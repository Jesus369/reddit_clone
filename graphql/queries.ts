import { gql } from "@apollo/client";

export const GET_POST_BY_POST_ID = gql`
  query getPostByPostId($id: ID!) {
    getPost(id: $id) {
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

export const GET_ALL_POST_BY_TOPIC = gql`
  query getAllPostByTopic($topic: String!) {
    getPostListByTopic(topic: $topic) {
      id
      username
      body
      created_at
      image
      title
      subreddit_id
      comments {
        created_at
        id
        text
        username
        post_id
      }
      subreddits {
        id
        created_at
        topic
      }
      votes {
        id
        created_at
        post_id
        upvote
        username
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

export const GET_VOTES_BY_POSTID = gql`
  query getVotesByPostId($id: ID!) {
    getVoteUsingPost_id(id: $id) {
      id
      upvote
      username
    }
  }
`;

export const GET_COMMENTS_BY_POSTID = gql`
  query getCommentByPostId($id: ID!) {
    GetCommentUsingPost_id(id: $id) {
      username
      text
    }
  }
`;
