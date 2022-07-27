import React, { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon
} from "@heroicons/react/outline";
import TimeAgo from "react-timeago";
import { Jelly } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

import { useMutation, useQuery } from "@apollo/client";
import { ADD_VOTE } from "../graphql/mutations";
import { GET_VOTES_BY_POSTID } from "../graphql/queries";

type Props = {
  post: typeof Post;
};

function Post({ post }: Props) {
  const [vote, setVote] = useState<boolean>();
  const { data: session } = useSession();

  // FETCHING VOTES

  const { data, loading } = useQuery<typeof Post>(GET_VOTES_BY_POSTID, {
    variables: {
      id: post?.id
    }
  });

  // POSTING VOTES
  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_VOTES_BY_POSTID, "getVoteUsingPost_id"]
  });

  useEffect(() => {
    const votes: Vote[] = data?.getVoteUsingPost_id;

    // Will return True or False
    const vote = votes?.find(
      (vote: any) => vote.username == session?.user?.name
    )?.upvote;

    // Set to True or False
    setVote(vote);
  }, [data]);

  // VOTE FUNCTION
  const upVote = async (isUpVote: boolean) => {
    if (!session) {
      toast("! You'll need to sign in to Vote!");
      return;
    }

    if (vote && isUpVote) return;
    if (vote === false && !isUpVote) return;

    console.log("voting is.....", isUpVote);

    await addVote({
      variables: {
        post_id: post?.id,
        upvote: isUpVote,
        username: session?.user?.name
      }
    });
  };

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVoteUsingPost_id;
    console.log(votes);
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    );

    if (votes?.length === 0) return 0;
    if (displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1;
    }

    return displayNumber;
  };

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    );

  return (
    <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600">
      {/* Votes */}
      <div className="flex flex-col items-center justify-start space-y-1 rounded-1-md bg-gray-50 p-4 text-gray-400">
        <ArrowUpIcon
          onClick={() => upVote(true)}
          className={`voteButtons hover:text-red-400 ${vote &&
            "text-red-400"} `}
        />
        <p className="text-xs font-bold text-black">{displayVotes(data)}</p>
        <ArrowDownIcon
          onClick={() => upVote(false)}
          className={`voteButtons hover:text-blue-400 ${vote === false &&
            "text-blue-400"} `}
        />
      </div>

      <Link href={`post/${post?.id}`}>
        <div className="p-3 pb-1">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar seed={post.subreddits[0]?.topic} />
            <p className="text-xs text-gray-400">
              <Link href={`subreddit/${post.subreddits[0]?.topic}`}>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post.subreddits[0]?.topic}
                </span>
              </Link>
              • Posted by u/
              {post.username} <TimeAgo date={post.created_at} />
            </p>
          </div>

          {/* Body */}
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <h1 className="mt-2 text-sm font-light">{post.body}</h1>
          </div>
          {/* Image */}
          <img className="w-full" src={post.image} alt="" />

          {/* Footer */}
          <div className="flex space-x-4 text-gray-400">
            <div className="postButton">
              <ChatAltIcon className="h-6 w-6" />
              <p>{post.comments.length} Comments</p>
            </div>
            <div className="postButton">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButton">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButton">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButton">
              <DotsHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Post;
