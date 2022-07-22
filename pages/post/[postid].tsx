import React from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import TimeAgo from "react-timeago";

import Post from "../../components/Post";
import { GET_POST_BY_POST_ID } from "../../graphql/queries";
import { NEW_COMMENT } from "../../graphql/mutations";
import Avatar from "../../components/Avatar";

type FormData = {
  comment: string;
};

const PostPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data, error } = useQuery(GET_POST_BY_POST_ID, {
    variables: {
      id: router.query.postid
    }
  });

  const [newComment] = useMutation(NEW_COMMENT, {
    refetchQueries: [GET_POST_BY_POST_ID, "getPostByPostId"]
  });

  const post: Post = data?.getPost;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>();

  const submitPost = handleSubmit(async FormData => {
    try {
      const notificaton = toast.loading("Posting your comment...");
      const commentData = await newComment({
        variables: {
          post_id: router.query.postid,
          text: FormData.comment,
          username: session?.user?.name
        }
      });
      console.log(commentData);

      setValue("comment", "");
      toast.success("Comment successfully posted", {
        id: notificaton
      });
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />
      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="text-sm">
          Comment as <span className="text-red-500">{session?.user?.name}</span>
        </p>

        {/* Post Comment Form */}
        <form
          onSubmit={submitPost}
          className="flex max-w-5xl flex-col space-y-2"
        >
          <textarea
            {...register("comment")}
            disabled={!session}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-500"
            placeholder={
              session ? "What are your thoughts?" : "Please sign in to comment"
            }
          />
          <button
            disabled={!session}
            type="submit"
            className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>
      </div>

      {/* Fetching Comments */}
      <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10">
        <hr className="py-2" />

        {post?.comments?.map(comment => (
          <div
            className="relative flex items-center space-x-2 space-y-5"
            key={comment.username}
          >
            <hr className="absolute top-10 left-7 h-16 z-0 border" />
            <div className="z-50">
              <Avatar seed={comment.id} />
            </div>
            <div className="flex flex-col">
              <p className="py-2 text-xs text-gray-400">
                <span className="font-semibold text-gray-600">
                  {comment.username}
                </span>
                •
                <TimeAgo date={comment.created_at} />
              </p>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
