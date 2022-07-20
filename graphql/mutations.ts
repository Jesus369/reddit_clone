import { gql } from "@apollo/client";

export const NEW_COMMENT = gql`
  mutation newComment($post_id: ID!, $text: String!, $username: String!) {
    insertComment(post_id: $post_id, text: $text, username: $username) {
      post_id
      text
      username
    }
  }
`;

export const ADD_VOTE = gql`
  mutation addVote($post_id: ID!, $upvote: Boolean!, $username: String!) {
    insertVote(post_id: $post_id, upvote: $upvote, username: $username) {
      id
      created_at
      post_id
      upvote
      username
    }
  }
`;

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
