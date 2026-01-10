import { PopulatedComment, PopulatedPost, PopulatedReaction } from "@/app/api/db/schema"
import { User } from "@/app/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum UserRoles {
  ADMIN = "admin",
  USER = "user"
}


export const userExample: User = {
  id: "1",
  name: "J7coder Vernard",
  email: "j7codercrack@gmail.com",
  authProvider: "local",
  picture: "https://www.shareicon.net/data/128x128/2016/09/15/829466_man_512x512.png",
  userRole: UserRoles.ADMIN,
}

export const commentExample: PopulatedComment = {
  id: "1",
  postId: "1",
  userId: "1",
  content: "This is a comment example",
  createdAt: new Date(),
  author: {
    id: "1",
    name: "J7coder",
    picture: "https://www.shareicon.net/data/128x128/2016/09/15/829466_man_512x512.png"
  },
}

export const reactionExample: PopulatedReaction = {
  id: "1",
  postId: "1",
  userId: "1",
  createdAt: new Date(),
  user: {
    id: "1",
    name: "J7coder",
    picture: "https://www.shareicon.net/data/128x128/2016/09/15/829466_man_512x512.png"
  },
  type: "like",
}

export const postExample: PopulatedPost = {
  id: "1",
  title: "Post Example",
  content: "This is a post example",
  image: "https://image-processor-storage.s3.us-west-2.amazonaws.com/images/281c2d4581ed27c8a258b0e79bc504ad/halo-of-neon-ring-illuminated-in-the-stunning-landscape-of-yosemite.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: "1",
  author: {
    id: "1",
    name: "J7coder Vernard",
    picture: "https://www.shareicon.net/data/128x128/2016/09/15/829466_man_512x512.png"
  },
  comments: [commentExample],
  reactions: [reactionExample]
}

export function hasTimePassed(requestAt: Date | number, { days = 0, hours = 0, minutes = 0, seconds = 0 }: { days?: number, hours?: number, minutes?: number, seconds?: number }) {
  const requestTime =
    requestAt instanceof Date ? requestAt.getTime() : requestAt;

  const durationMs =
    days * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000;

  return Date.now() - requestTime >= durationMs;
}

export function getErrorMessage(error: unknown, context: string) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return `Error while ${context}`;
}
