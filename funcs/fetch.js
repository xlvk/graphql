import { Alphabet } from './MyAlphabet';
import { isProgrammingLanguage } from './funcs';

export async function fetchSkillData() {
    try {
        const response = await fetch(Alphabet.A + 'api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({ query: Alphabet.J }),
        });

        const data = await response.json();

        if (response.ok && data.data && data.data.transaction) {
            const skillMap = new Map();
            const languageMap = new Map();
            // console.log(data.data.transaction);

            // Group skills by name and sum their values
            data.data.transaction.forEach(({ type, amount }) => {
                const skillName = type.replace(/^.*skill_/, '');
                if (isProgrammingLanguage(skillName)) {
                    const existingValue = languageMap.get(skillName) || 0;
                    if (existingValue > amount) {
                        amount = existingValue;
                    }
                    languageMap.set(skillName, amount);
                } else {
                    const existingValue = skillMap.get(skillName) || 0;
                    if (existingValue > amount) {
                        amount = existingValue;
                    }
                    skillMap.set(skillName, amount);
                }
            });

            // Convert the Map to an array of objects
            return {
                skills: Array.from(skillMap.entries()).map(([skill, value]) => ({ skill, value })),
                languages: Array.from(languageMap.entries()).map(([skill, value]) => ({ skill, value }))
            };
        } else {
            throw new Error(`GraphQL error: ${data.errors ? data.errors[0].message : 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
        return { skills: [], languages: [] };
    }
}

export async function fetchUserLevel(userLogin) {
    console.log("Fetching user level...");
    try {
        const response = await fetch(Alphabet.A + "api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({
                query: Alphabet.H,
                variables: { userlogin: userLogin },
            }),
        });

        const data = await response.json();
        console.log("Data:", data);
        if (response.ok) {
            const userLevel = data.data.event_user[0].level;
            console.log("User level:", userLevel);
            return userLevel;
        } else {
            throw new Error(`GraphQL error: ${data.errors[0].message}`);
        }
    } catch (error) {
        console.error("Error fetching user level:", error);
        return null; // Return null in case of an error
    }
}

export async function fetchFailedAudits(VAriableName) {
    try {
        const response = await fetch(Alphabet.A + "api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${VAriableName}`,
            },
            body: JSON.stringify({ query: Alphabet.E }),
        });
        const data = await response.json();
        console.log("Failed Audits:", data.data);
        return data.data.audit_aggregate.aggregate.count;
    } catch (error) {
        console.error("Error fetching failed audits:", error);
        return 0;
    }
}

export async function fetchPassedAudits(VAriableName) {
    try {
        const response = await fetch(Alphabet.A + "api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${VAriableName}`,
            },
            body: JSON.stringify({ query: Alphabet.F }),
        });
        const data = await response.json();
        return data.data.audit_aggregate.aggregate.count;
    } catch (error) {
        console.error("Error fetching passed audits:", error);
        return 0;
    }
}

export async function fetchInProgressProjects() {
    try {
        const response = await fetch(Alphabet.A + "api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({ query: Alphabet.I }),
        });

        const data = await response.json();

        if (response.ok && data.data && data.data.progress) {
            const inProgressProjects = data.data.progress.length;
            const inProgressElement = document.getElementById("in-proccess");
            if (inProgressElement) {
                inProgressElement.textContent = inProgressProjects;
            }
        } else {
            throw new Error(`GraphQL error: ${data.errors ? data.errors[0].message : "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error fetching in-progress projects:", error);
    }
}
