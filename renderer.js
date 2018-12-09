const { remote, ipcRenderer } = require("electron");
const rndstr = require("randomstring");
const mainProcess = remote.require("./main.js");

const handles = document.querySelectorAll(".handle");
const handleWrapper = document.getElementById("handle-wrapper");
const mainImageContainer = document.getElementById("main-image");
const canvas = document.getElementById("lines");
const ctx = canvas.getContext("2d");
let openFile = "";

document.getElementById("open").addEventListener("click", () => {
  mainProcess.getFileFromUser();
});

document.getElementById("save").addEventListener("click", () => {
  document.getElementById("preview-image").src = "";
  const nw = document.getElementById("main-image").naturalWidth;
  const nh = document.getElementById("main-image").naturalHeight;
  mainProcess.convert(
    openFile,
    `/Users/antonioradovcic/Desktop/skewbacca_${rndstr.generate(8)}.jpg`,
    getSkewCoordinates(),
    nw,
    nh
  );
});

ipcRenderer.on("file-opened", (event, file, content) => {
  console.log(file);
  openFile = file;
  mainImageContainer.src = file;
  mainImageContainer.addEventListener("dragstart", e => {
    e.preventDefault();
  });

  handleWrapper.style.opacity = "1";
  setTimeout(() => {
    canvas.setAttribute("width", handleWrapper.offsetWidth);
    canvas.setAttribute("height", handleWrapper.offsetHeight);
    drawLines();
  }, 10);
});

ipcRenderer.on("file-saved", (event, targetFileName) => {
  console.log(targetFileName);
  document.getElementById("preview-image").src = targetFileName;
});

handles.forEach(handle => {
  handle.addEventListener("dragend", e => {
    if (!e.pageX && !e.pageY) return;
    e.target.style.left = e.pageX - handleWrapper.offsetLeft + "px";
    e.target.style.top = e.pageY - handleWrapper.offsetTop + "px";
    e.target.classList.remove("dragged");
  });
  handle.addEventListener("drag", e => {
    if (!e.pageX && !e.pageY) return;
    e.target.style.left = e.pageX - handleWrapper.offsetLeft + "px";
    e.target.style.top = e.pageY - handleWrapper.offsetTop + "px";
    drawLines();
  });
  handle.addEventListener("dragstart", e => {
    const img = document.createElement("span");
    img.style.display = "none";
    e.dataTransfer.setDragImage(img, 0, 0);
    e.target.classList.add("dragged");
  });
});

function getSkewCoordinates() {
  const TLX = percX(document.getElementById("topleft").offsetLeft);
  const TLY = percY(document.getElementById("topleft").offsetTop);
  const TRX = percX(document.getElementById("topright").offsetLeft);
  const TRY = percY(document.getElementById("topright").offsetTop);
  const BRX = percX(document.getElementById("bottomright").offsetLeft);
  const BRY = percY(document.getElementById("bottomright").offsetTop);
  const BLX = percX(document.getElementById("bottomleft").offsetLeft);
  const BLY = percY(document.getElementById("bottomleft").offsetTop);
  return { TLX, TLY, TRX, TRY, BRX, BRY, BLX, BLY };
}

function percX(n) {
  const nat = document.getElementById("main-image").naturalWidth;
  return (n / handleWrapper.getBoundingClientRect().width) * nat;
}

function percY(n) {
  const nat = document.getElementById("main-image").naturalHeight;
  return (n / handleWrapper.getBoundingClientRect().height) * nat;
}

function drawLines() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 1;

  const TLX = document.getElementById("topleft").offsetLeft;
  const TLY = document.getElementById("topleft").offsetTop;
  const TRX = document.getElementById("topright").offsetLeft;
  const TRY = document.getElementById("topright").offsetTop;
  const BRX = document.getElementById("bottomright").offsetLeft;
  const BRY = document.getElementById("bottomright").offsetTop;
  const BLX = document.getElementById("bottomleft").offsetLeft;
  const BLY = document.getElementById("bottomleft").offsetTop;

  ctx.beginPath();
  ctx.lineTo(TLX, TLY);
  ctx.lineTo(TRX, TRY);
  ctx.lineTo(BRX, BRY);
  ctx.lineTo(BLX, BLY);
  ctx.lineTo(TLX, TLY);
  ctx.stroke();
  console.log("DRAWRING", TLX, TLY);
}
