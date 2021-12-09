import "./app_menu.ts";
import "./app_root.ts";

const eventSource = new EventSource("/updates");
eventSource.addEventListener("message", (e) => {
  console.log(e, e.data);
  const { id } = JSON.parse(e.data);
  if (id === "root") {
    console.log("reloading");
    location.reload();
  }
});
