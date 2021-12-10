export const createReloadScript = (forRoot?: boolean) => `
  const eventSource = new EventSource("/updates");
  eventSource.addEventListener("message", (e) => {
    const { id } = JSON.parse(e.data);
    if (${forRoot ? "id === 'root'" : "location.pathname.includes(id)"}) {
      location.reload();
    }
  });
`;
