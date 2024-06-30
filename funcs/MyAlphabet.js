// Define an object to hold all variables and constants
export const Alphabet = {
  /* A is for the link of reboot01.com */
  A: "https://learn.reboot01.com/",
  /* B is for the base info Query */
  B: `
  query User {
    user {
      id
      login
      auditRatio
      totalDown
      totalUp
    }
  }
  `,
  /* C is for the info Query */
  C: `
    query User1 {
      user {
        attrs
        auditRatio
        campus
        createdAt
        email
        firstName
        githubId
        id
        lastName
        login
        profile
        totalDown
        totalUp
        updatedAt
      }
    }
  `,
  /**
  * All projects (within the /bahrain/bh-module) done by the user.
  *
  * Projects can be of type excersise or project
  */
  D: `
  query Transaction {
    transaction(
      where: {
        type: { _eq: "xp" }
        event: { path: { _eq: "/bahrain/bh-module" } }
      }
    ) {
      amount
      path
      createdAt
      object {
        name
        object_type {
          type
        }
      }
    }
  }
  `,
  /**
   *  Number of times a user failed someone else's audit
   */
  E: `
  query Audit_aggregate {
    audit_aggregate(where: { grade: { _lt: "1" } }) {
      aggregate {
        count
      }
    }
  }
  `,
    /**
   *  Number of times a user passed someone else's audit
   */
  F: `
  query Audit_aggregate2 {
    audit_aggregate(where: { grade: { _gte: "1" } }) {
      aggregate {
        count
      }
    }
  }
  `,
  /**
   *  Get the user's XP
   */
  G: `
  query Transaction_aggregate {
    transaction_aggregate(
      where: {
        event: { path: { _eq: "/bahrain/bh-module" } }
        type: { _eq: "xp" }
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
  `,
  /**
   *  get the user's level
   */
  H: `
  query Event_user($userlogin: String) {
    event_user(
      where: {
        userLogin: { _eq: $userlogin }
        event: { path: { _eq: "/bahrain/bh-module" } }
      }
    ) {
      level
    }
  }
  `,
  /**
   *  src url for the chart.js library
   */
  I: `
  <script defer src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>
  `,
/**
 * Get every skill and their amount (for radial graph)
 */
  J: `
    query Transaction2 {
    transaction(
      where: {
        type: {
          _iregex: "(^|[^[:alnum:]_])[[:alnum:]_]*skill_[[:alnum:]_]*($|[^[:alnum:]_])"
        }
      }
    ) {
      amount
      type
    }
  }
  `,
/**
 * each XP transaction with time
 */
  K: `
    query Transaction3 {
    transaction(where: { type: { _eq: "xp" } }) {
      amount
      createdAt
    }
  }
  `,
  /**
 * to every project and what's needed to open it.
 */
  L: `
  query get_child_for_edit {
	object_child(where: {parent:{name:{_eq:"Module"}} }) {
		child{
  		name
		}
  	baseReq:attrs(path:"baseSkills")
  	requirements: attrs(path:"requirements")
	}
}
  `,
  /**
  * get the state of the user in the program
  */
  M: `
  query DevStaute {
  object(where:{name:{_eq:"Module"}}){
    attrs
  }
}
  `,
  /**
   * this is the query for the timeline graph that will be user later for one of the new added pages.
   * 
  */
  N: `
    query timeline_graph {
      user {
        login
        timeline: transactions(
          where: {type: {_eq: "xp"}, _or: [{attrs: {_eq: {}}}, {attrs: {_has_key: "group"}}], _and: [{path: {_nlike: "%/piscine-js/%"}}, {path: {_nlike: "%/piscine-go/%"}}]}
        ) {
          amount
          createdAt
          path
        }
      }
    }
  `,
  O: "",
  P: "",
  Q: "",
  R: "",
  S: "",
  T: "",
  U: "",
  V: "",
  W: "",
  X: "",
  Y: "",
  Z: "",
};
