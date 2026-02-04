// src/Graphql/quries.js

const GRAPHQL_ENDPOINT = "https://Learn.01founders.co/api/graphql-engine/v1/graphql";

export async function graphqlRequest(query, variables = {}) {
  const token = localStorage.getItem("jwt");

  if (!token) {
    throw new Error("No JWT found");
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const data = await response.json();

  if (data.errors) {
    console.error(data.errors);
    throw new Error("GraphQL error");
  }

  return data.data;
}

// ================= QUERIES =================

export const GET_USER_INFO = `
  query {
    user {
      id
      login
      firstName
      lastName
      campus
      totalUp
      totalDown
    }
  }
`;

export const GET_XP_TRANSACTIONS = `
  query {
    transaction(
      where: { type: { _eq: "xp" } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      object {
        name
      }
    }
  }
`;

export const GET_SKILLS = `
  query {
    transaction(
      where: { type: { _like: "skill_%" } }
    ) {
      type
      amount
    }
  }
`;

export const GET_OBJECT_BY_ID = `
  query GetObjectById($id: Int!) {
    object(where: { id: { _eq: $id }}) {
      id
      name
      type
    }
  }
`;

export const GET_RESULTS_WITH_USER = `
  query {
    result {
      id
      grade
      createdAt
      object {
        id
        name
        type
      }
    }
  }
`;
