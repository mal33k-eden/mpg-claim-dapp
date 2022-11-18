import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: "bcrpoje2",
  dataset: "production",
  token:
    "skZ5C5Tum0o644Ulzwh71ohMWX9tktU1jxzjVIZuhiJJxFFL3i0xsYggbBRD8qENJyh6b7C6ln5ltfnrYeQJGmupFGnA5PcJhPhMguIW0XPnJLqNTO3D6cEXnGbedoWDG9P8Elz8UjGnU7sMOr1Z5lVe6Guoldh8dxN96rq5Wd9B7YO65M8v",
});

export default client;
