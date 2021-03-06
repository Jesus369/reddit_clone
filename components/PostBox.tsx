import React, { useState } from "react";
import { useSession } from "next-auth/react";

import Avatar from "./Avatar";
import { PhotographIcon } from "@heroicons/react/outline";
import { LinkIcon } from "@heroicons/react/solid";

import { useForm } from "react-hook-form";

import { useMutation } from "@apollo/client";
import client from "../apollo-client";
import { ADD_POST, ADD_SUBREDDIT } from "../graphql/mutations";
import { GET_SUBREDDIT_BY_TOPIC, GET_ALL_POSTS } from "../graphql/queries";

// Data fields the form will contain
type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
};

type Props = {
  subreddit?: string;
};

const PostBox = ({ subreddit }: Props) => {
  const { data: session } = useSession();
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, "getPostList"]
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);

  const [imageBoxOpen, setImageBoxOpen] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async formData => {
    console.log("postings");
    try {
      const {
        data: { getSubredditListByTopic }
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit
        }
      });
      console.log(getSubredditListByTopic);
      const subredditExists = getSubredditListByTopic.length > 0;

      if (!subredditExists) {
        //   Create subreddit

        const {
          data: { insertSubreddit: newSubreddit }
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit
          }
        });

        console.log("Creating new subreddit, ", newSubreddit);

        const image = formData.postImage || "";

        const {
          data: { insertPost: newPost }
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        });

        console.log("new post, ", newPost);
      } else {
        console.log("Using existing subreddit!");
        const image = formData.postImage || "";

        const {
          data: { insertPost: newPost }
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        });

        console.log("new post", newPost);
      }
      setValue("postBody", "");
      setValue("postImage", "");
      setValue("postTitle", "");
      setValue("subreddit", "");
    } catch (err) {
      // Use existing subreddit
    }
  });
  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-20 z-50 rounded-md border border-gray-300 bg-white p-2"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <Avatar seed="jesus" large />

        <input
          {...register("postTitle", { required: true })} //
          disabled={!session}
          type="text"
          className="flex-1 bg-gray-50 p-2 pl-5 outline-none rounded-md"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit} `
                : "Create A Post By Entering A Title"
              : "Sign In To Post"
          }
        />

        <PhotographIcon
          //!imageBoxOpen sets the value as the opposite of what the value currently is
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${imageBoxOpen &&
            "text-blue-300"} `}
        />
        <LinkIcon className="h-6 text-gray-300" />
      </div>

      {/* !!watch(True or False) watch for activity on the postTitle */}
      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          {/* Body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register("postBody")}
              type="text"
              placeholder="Text (optional)"
            />
          </div>

          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register("subreddit", { required: true })}
                type="text"
                placeholder="i.e. reactjs"
              />
            </div>
          )}
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register("postImage")}
                type="text"
                placeholder="Optional..."
              />
            </div>
          )}
        </div>
      )}

      {/* Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="space-y-2 p-2 text-red-500">
          {errors.postTitle?.type === "required" && (
            <p>- A Post Title is required</p>
          )}

          {errors.subreddit?.type === "required" && (
            <p>- A Subreddit is required</p>
          )}
        </div>
      )}

      {!!watch("postTitle") && (
        <button type="submit" className="w-full rounded-full bg-blue-300 p-2">
          Create Post
        </button>
      )}
    </form>
  );
};

export default PostBox;
