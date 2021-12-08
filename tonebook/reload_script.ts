export const reloadScript = `
  const eventSource = new EventSource("/updates");
  eventSource.addEventListener("message", (e) => {
    const { id } = JSON.parse(e.data);
    if (location.pathname.includes(id)) {
      location.reload();
    }
  });
`;
