import { ipcRenderer } from "electron";
import { Coordinates } from "../types/types";
import rndstr from "randomstring";

const handles = document.querySelectorAll(".handle");
const handleWrapper = document.getElementById("handle-wrapper");
const mainImageContainer = <HTMLImageElement>(
  document.getElementById("main-image")
);
const stage = <HTMLDivElement>document.getElementById("stage");
const canvas = <HTMLCanvasElement>document.getElementById("lines");
const ctx = canvas.getContext("2d");

stage.addEventListener("dragover", e => {
  if (e.target !== stage) return;
  e.preventDefault();
  const file = e.dataTransfer.items[0];
  if (["image/jpeg"].includes(file.type)) {
    stage.classList.add("drag");
  } else {
    stage.classList.add("error");
  }
});

stage.addEventListener("dragleave", e => {
  stage.classList.remove("drag");
  stage.classList.remove("error");
});

stage.addEventListener("dragend", e => {
  stage.classList.remove("drag");
  stage.classList.remove("error");
});

stage.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (["image/jpeg"].includes(file.type)) {
    ipcRenderer.send("open-file", file.path);
  } else {
    alert("No bueno!");
  }
  stage.classList.remove("drag");
  stage.classList.remove("error");
  e.preventDefault();
});

function convertCurrentSelection() {
  const nw = (<HTMLImageElement>document.getElementById("main-image"))
    .naturalWidth;
  const nh = (<HTMLImageElement>document.getElementById("main-image"))
    .naturalHeight;
  ipcRenderer.send("convert-full", getSkewCoordinates(1), nw, nh);
}

function previewCurrentSelection() {
  (<HTMLImageElement>document.getElementById("preview-image")).src = "";
  document.getElementById("preview-image").classList.remove("hidden");
  document.getElementById("preview-image").classList.add("pending");
  document.getElementById("preview-spinner").classList.add("active");
  const nw = (<HTMLImageElement>document.getElementById("main-image"))
    .naturalWidth;
  const nh = (<HTMLImageElement>document.getElementById("main-image"))
    .naturalHeight;
  ipcRenderer.send(
    "convert-preview",
    `skewbacca_${rndstr.generate(8)}.jpg`,
    getSkewCoordinates(0.2),
    nw * 0.2,
    nh * 0.2
  );
}

function openFile(file: string) {
  mainImageContainer.src = file;
  mainImageContainer.addEventListener("dragstart", e => {
    e.preventDefault();
  });

  handleWrapper.style.opacity = "1";
  setTimeout(() => {
    canvas.setAttribute("width", `${handleWrapper.offsetWidth}`);
    canvas.setAttribute("height", `${handleWrapper.offsetHeight}`);
    drawLines();
  }, 10);
}

ipcRenderer.on("file-opened", (_event, file: string, _content) => {
  openFile(file);
});

ipcRenderer.on("save-intent", convertCurrentSelection);

ipcRenderer.on("file-saved", (_event, targetFileName) => {
  console.log(targetFileName);
  (<HTMLImageElement>(
    document.getElementById("preview-image")
  )).src = targetFileName;
  document.getElementById("preview-image").classList.remove("pending");
  document.getElementById("preview-spinner").classList.remove("active");
});

handles.forEach(handle => {
  //--
  handle.addEventListener("dragend", (e: DragEvent) => {
    if (!e.pageX && !e.pageY) return;
    (<HTMLButtonElement>e.target).style.left =
      e.pageX - handleWrapper.offsetLeft + "px";
    (<HTMLButtonElement>e.target).style.top =
      e.pageY - handleWrapper.offsetTop + "px";
    (<HTMLButtonElement>e.target).classList.remove("dragged");
    previewCurrentSelection();
  });
  //--
  handle.addEventListener("drag", (e: DragEvent) => {
    if (!e.pageX && !e.pageY) return;
    (<HTMLButtonElement>e.target).style.left =
      e.pageX - handleWrapper.offsetLeft + "px";
    (<HTMLButtonElement>e.target).style.top =
      e.pageY - handleWrapper.offsetTop + "px";
    drawLines();
  });
  //--
  handle.addEventListener("dragstart", (e: DragEvent) => {
    const img = document.createElement("span");
    img.style.display = "none";
    e.dataTransfer.setDragImage(img, 0, 0);
    (<HTMLButtonElement>e.target).classList.add("dragged");
  });
});

function getSkewCoordinates(scale: number): Coordinates {
  const TLX = percX(document.getElementById("topleft").offsetLeft, scale);
  const TLY = percY(document.getElementById("topleft").offsetTop, scale);
  const TRX = percX(document.getElementById("topright").offsetLeft, scale);
  const TRY = percY(document.getElementById("topright").offsetTop, scale);
  const BRX = percX(document.getElementById("bottomright").offsetLeft, scale);
  const BRY = percY(document.getElementById("bottomright").offsetTop, scale);
  const BLX = percX(document.getElementById("bottomleft").offsetLeft, scale);
  const BLY = percY(document.getElementById("bottomleft").offsetTop, scale);
  return { TLX, TLY, TRX, TRY, BRX, BRY, BLX, BLY };
}

function percX(n, scale) {
  const nat = (<HTMLImageElement>document.getElementById("main-image"))
    .naturalWidth;
  return (n / handleWrapper.getBoundingClientRect().width) * (nat * scale);
}

function percY(n, scale) {
  const nat = (<HTMLImageElement>document.getElementById("main-image"))
    .naturalHeight;
  return (n / handleWrapper.getBoundingClientRect().height) * (nat * scale);
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
}
