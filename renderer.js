const { remote, ipcRenderer } = require("electron");
const mainProcess = remote.require("./main.js");

const handles = document.querySelectorAll(".handle");
const handleWrapper = document.getElementById("handle-wrapper");
let openFile = "";

document.getElementById("open").addEventListener("click", () => {
  mainProcess.getFileFromUser();
});

document.getElementById("save").addEventListener("click", () => {
  const nw = document.getElementById("main-image").naturalWidth;
  const nh = document.getElementById("main-image").naturalHeight;
  mainProcess.convert(
    openFile,
    "/Users/antonioradovcic/Desktop/hmpf.jpg",
    getSkewCoordinates(),
    nw,
    nh
  );
});

ipcRenderer.on("file-opened", (event, file, content) => {
  console.log(file);
  openFile = file;
  document.getElementById("main-image").src = file;
  handleWrapper.style.opacity = "1";
});

ipcRenderer.on("file-saved", (event, targetFileName) => {
  console.log(targetFileName);
  document.getElementById("preview-image").src = "";
  setTimeout(() => {
    document.getElementById("preview-image").src = targetFileName;
  }, 10);
});

handles.forEach(handle => {
  handle.addEventListener("dragend", e => {
    if (!e.pageX && !e.pageY) return;
    e.target.style.top = e.pageY + "px";
    e.target.style.left = e.pageX + "px";
  });
  handle.addEventListener("drag", e => {
    if (!e.pageX && !e.pageY) return;
    e.target.style.top = e.pageY + "px";
    e.target.style.left = e.pageX + "px";
  });
  handle.addEventListener("dragstart", e => {
    const img = document.createElement("span");
    img.style.display = "none";
    e.dataTransfer.setDragImage(img, 0, 0);
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
  console.log(n, handleWrapper.getBoundingClientRect().height, nat);
  return (n / handleWrapper.getBoundingClientRect().height) * nat;
}
