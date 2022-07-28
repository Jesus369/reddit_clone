export type Comment = {
  created_at: string;
  id: number;
  post_id: number;
  text: string;
  username: string;
};

export type Vote = {
  created_at: string;
  id: number;
  post_id: number;
  upvote: boolean;
  username: string;
};

type Subreddit = {
  created_at: string;
  id: number;
  topic: string;
};

export type TypePost = {
  body: string;
  created_at: string;
  [id: number]: any;
  image: string;
  subreddit_id: number;
  title: string;
  username: string;
  votes: Vote[];
  comments: Comment[];
  subreddits: Subreddit[];
};

// Response

type Response = {
  post: Post;
};

type inputProps = {
  id: number;
};

type ChildProps = ChildDataProps<InputProps, Response, Variables>;
