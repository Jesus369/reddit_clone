import { gql } from "@apollo/client";

export const ADD_SUBREDDIT = gql`
  mutation addSubreddit($topic: String!) {
    insertSubreddit(topic: $topic) {
      id
    }
  }
`;

export const ADD_POST = gql`
  mutation addPost(
    $title: String!
    $body: String
    $username: String!
    $image: String
    $subreddit_id: ID!
  ) {
    insertPost(
      title: $title
      body: $body
      username: $username
      image: $image
      subreddit_id: $subreddit_id
    ) {
      title
      body
      username
      image
      subreddit_id
    }
  }
`;
