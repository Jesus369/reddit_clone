import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
  query getAllPosts {
    getPostList {
      body
      created_at
      id
      image
      title
      subreddit_id
      username
      comments {
        id
        text
        username
        created_at
        post_id
      }
      subreddits {
        id
        topic
        created_at
      }
      votes {
        id
        upvote
        username
        created_at
        post_id
      }
    }
  }
`;

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query getSubredditByTopic($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;
