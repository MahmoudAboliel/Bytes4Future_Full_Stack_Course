import { createElement } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import {
  Root,
  AllPosts,
  MyPosts,
  PostDetails,
  Albums,
  Photos,
  Todos,
  NotFound,
} from "@/pages";

export const URL = "http://localhost:3000";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        element: createElement(Navigate, { to: "/posts", replace: true }),
      },

      {
        path: "posts",
        children: [
          { index: true, Component: AllPosts },
          { path: "my", Component: MyPosts },
          { path: ":postId", Component: PostDetails },
        ],
      },

      {
        path: "albums",
        children: [
          { index: true, Component: Albums },
          { path: ":albumId/photos", Component: Photos },
        ],
      },

      { path: "todos", Component: Todos },

      { path: "*", Component: NotFound },
    ],
  },
]);

export const routes = [
  { id: 1, href: "/posts", label: "All Posts" },
  { id: 2, href: "/posts/my", label: "My Posts" },
  { id: 3, href: "/albums", label: "Albums" },
  { id: 4, href: "/todos", label: "Todos" },
];

export const pageMeta = {
  allPosts: {
    title: "All Posts",
    description: "Browse all posts from the community and explore what's new.",
  },
  myPosts: {
    title: "My Posts",
    description: "A personal collection of the posts you've created or saved.",
  },
  postDetails: {
    title: "Post Details",
    description:
      "Read the full post along with its comments and join the conversation.",
  },
  albums: {
    title: "My Albums",
    description: "Explore your albums and open any one to view its photos.",
  },
  albumPhotos: {
    title: "Album Photos",
    description: "Browse through all the photos in this album.",
  },
  todos: {
    title: "My Todos",
    description: "Keep track of your tasks and stay on top of what matters.",
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
  },
} as const;