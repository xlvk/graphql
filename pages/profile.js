import { LoadNav, navBarItems } from "../funcs/navbar";
import * as d3 from 'd3';
import { Alphabet } from "../funcs/MyAlphabet";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';



/**@
 * This function fetches the profile page
 */

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
export const Profile = async () => {
  // check if the user is logged in.
  const VAriableName = localStorage.getItem("jwt");
  if (!VAriableName) {
    window.location.href = "/login";
    return;
  }
  //     const VAriableName = localStorage.getItem("VAriableName");
  //     if (!VAriableName) {
  //       window.location.href = "/login.html";
  //       return;
  //     }
  document.body.innerHTML = `
  ${LoadNav()}
<body>

  <section class="content">
    <div class="left-content">
      <div class="search-and-check">
      </div>

      <div class="header">
        <h1 id="wlcoming"></h1>
      </div>
      <div class="reviews">
        <div class="review-container">
          <div class="card review-card">
            <h2>Last Submitted Project:</h2>
            <p id="last-submit">
            </p>
          </div>
          
          <div class="card review-card">
            <h2>Audit Performance</h2>
            <p id="level">
            </p>
          </div>

          <div class="card review-card graph">
            <h2 id="display-ratio"></h2>
            <p id="xpRatio">
            </p>
          </div>

          <!-- <div class="card review-card graph">
            <h2>The TimeLine:</h2>
            <script src="https://d3js.org/d3.v7.min.js" async></script>
            <div id="timeline-container">
              <svg id="timeline"></svg>
            </div>
          </div> -->
            <div class="card review-card graph">
              <h2>Audit Performance:</h2>
              <div id="audit-container">
                <svg id="myAudits"></svg>
              </div>
            </div>
          <!-- <div class="auto"> -->
            <div class="card review-card graph">
              <h2>Skill Performance:</h2>
              <div id="skill-container">
                <svg id="mySkill"></svg>
              </div>
            </div>
            <div class="card review-card graph">
              <h2>Language Performance:</h2>
              <div id="language-container">
                <svg id="mySkill"></svg>
              </div>
            </div>
          <!-- </div> -->
        </div>
      </div>
    </div>

    <div class="right-content">
      <!-- <div class="interaction-control interactions">
              <div class="toggle" onclick="switchTheme()">
                <div class="mode-icon moon">
                  <i class="bx bxs-moon"></i>
                </div>
                <div class="mode-icon sun hidden">
                  <i class="bx bxs-sun"></i>
                </div>
              </div>
            </div> -->

      <div class="analytics">
        <h1>Analytics</h1>
        <div class="analytics-container">
          <div class="total-events">
            <div class="event-number card">
              <h2>Past Events</h2>
              <p id="past-event"></p>
              <i class="bx bx-check-circle"></i>
            </div>
            <div class="event-number card">
              <h2>Upcoming Events</h2>
              <p>3</p>
              <i class="bx bx-timer"></i>
            </div>
          </div>

          <div class="chart" id="doughnut-chart">
            <h2>XP per Project</h2>
            <div id="doughnut" class="canvas"></div>
            <ul></ul>
          </div>
        </div>
      </div>
    </div>
  </section>

</body>`;

  //! Active Navbar Item
  navBarItems();

  let query = `
  query Global  {
    user {
      login
      attrs
      campus
      level: transactions(
        where: {type: {_eq: "level"}, path: {_ilike: "%/school-curriculum/%"}}
        order_by: {amount: desc}
        limit: 1
      ) {
        amount
      }
      upAmount: transactions_aggregate(where: {type: {_eq: "up"}}) {
        aggregate {
          sum {
            amount
          }
        }
      }
      downAmount: transactions_aggregate(where: {type: {_eq: "down"}}) {
        aggregate {
          sum {
            amount
          }
        }
      }
      xpAmount: transactions_aggregate(
        where: {type: {_eq: "xp"}, _or: [{attrs: {_eq: {}}}, {attrs: {_has_key: "group"}}], _and: [{path: {_nlike: "%/piscine-js/%"}}, {path: {_nlike: "%/piscine-go/%"}}]}
      ) {
        aggregate {
          sum {
            amount
          }
        }
      }
      timeline: transactions(
        where: {type: {_eq: "xp"}, _or: [{attrs: {_eq: {}}}, {attrs: {_has_key: "group"}}], _and: [{path: {_nlike: "%/piscine-js/%"}}, {path: {_nlike: "%/piscine-go/%"}}]}
      ) {
        amount
        createdAt
        path
      }
    }
}
    `;

  console.log(query);

  //! create this function to create the graph and the Timeline for the user
  createGraph(VAriableName, query);
  await myAudits(VAriableName);
  mySkills();

};

// export async function fetche(VAriableName, query) {
//   try {
//     const response = await fetch(
//       Alphabet.A + "api/graphql-engine/v1/graphql",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${VAriableName}`,
//         },
//         body: JSON.stringify({ query }),
//       }
//     );

//     const data = await response.json();
//     if (!data.data.user || data.data.user.length === 0) {
//       console.error("Error: data.data or data.data.user is undefined or empty.");
//       return;
//     }
//     const user = data.data.user[0];
//     displayUserInfo(user);
//     createTimeline(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }


// export function createTimeline(thicc, smoll, data) {
//   console.log("Creating timeline...");
//   // remove the previous timeline
//   d3.select("#timeline").selectAll("*").remove();
//   d3.select(".tooltip").remove();

//   // sort the timeline data by date
//   data.data.user[0].timeline.sort(
//     (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//   );
//   // get the start and end date of the timeline
//   const startDate = new Date(data.data.user[0].timeline[0].createdAt);
//   const endDate = new Date(
//     data.data.user[0].timeline[data.data.user[0].timeline.length - 1].createdAt
//   );

//   // set the start and end date to the first and last day of the month in order to get the correct width of the timeline
//   startDate.setDate(1);
//   startDate.setHours(0, 0, 0, 0);
//   endDate.setDate(1);
//   endDate.setMonth(endDate.getMonth() + 1);
//   endDate.setHours(0, 0, 0, 0);

//   // set the margins and width and height of the timeline
//   const margin = { top: 20, right: 40, bottom: 40, left: 60 },
//     width = thicc - margin.left - margin.right,
//     height = smoll - margin.top - margin.bottom;

//   // create a new svg element with the width and height of the timeline-container
//   const svg = d3
//     .select("#timeline")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

//   const x = d3.scaleTime().domain([startDate, endDate]).range([0, width]);
//   if (thicc < 800 && thicc > 600) {
//     svg
//       .append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(
//         d3
//           .axisBottom(x)
//           .ticks(d3.timeMonth.every(1))
//           .tickFormat(d3.timeFormat("%b %Y"))
//       );
//   } else if (thicc < 600 && thicc >= 500) {
//     svg
//       .append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(
//         d3
//           .axisBottom(x)
//           .ticks(d3.timeMonth.every(1))
//           .tickFormat(d3.timeFormat("%b %y"))
//       );
//   } else if (thicc < 500 && thicc > 0) {
//     svg
//       .append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(
//         d3
//           .axisBottom(x)
//           .ticks(d3.timeMonth.every(1))
//           .tickFormat(d3.timeFormat("%b"))
//       );
//   } else {
//     svg
//       .append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(
//         d3
//           .axisBottom(x)
//           .ticks(d3.timeMonth.every(1))
//           .tickFormat(d3.timeFormat("%B %Y"))
//       );
//   }

//   const tooltip = d3
//     .select("body")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0)
//     .style("left", "50%") // Set initial left position
//     .style("top", "0"); // Set initial top position

//   const mergeOverlappingDots = (data) => {
//     let mergedData = [];
//     let tempData = [];

//     data.forEach((item, i) => {
//       if (i === 0) {
//         tempData.push(item);
//       } else if (
//         Math.abs(
//           x(new Date(data[i - 1].createdAt)) - x(new Date(item.createdAt))
//         ) < 6
//       ) {
//         tempData.push(item);
//       } else {
//         mergedData.push(tempData);
//         tempData = [item];
//       }
//     });

//     mergedData.push(tempData);
//     return mergedData;
//   };

//   const mergedData = mergeOverlappingDots(data.data.user[0].timeline);

//   const colorScale = d3
//     .scaleLinear()
//     .domain([0, d3.max(data.data.user[0].timeline, (d) => d.amount)])
//     .range(["#3366cc", "#cc3366"]);

//   svg
//     .selectAll(".dot")
//     .data(mergedData)
//     .enter()
//     .append("circle")
//     .attr("class", "dot")
//     .attr("r", (d) => 5)
//     .attr("cx", (d) => x(new Date(d[0].createdAt)))
//     .attr("cy", height)
//     .attr("fill", (d) => colorScale(d[0].amount)) // Fill dots with color based on amount
//     .on("mouseover", function (event, d) {
//       tooltip.transition().duration(200).style("opacity", 0.9);

//       let tooltipHtml = "";

//       // Group projects by date
//       let dateGroupedProjects = d.reduce((group, project) => {
//         let date = d3.timeFormat("%B %d, %Y")(new Date(project.createdAt));
//         if (!group[date]) group[date] = [];
//         group[date].push(project);
//         return group;
//       }, {});

//       // Generate tooltip HTML

//       for (let date in dateGroupedProjects) {
//         tooltipHtml += `${date}<br/>`;
//         tooltipHtml += dateGroupedProjects[date]
//           .map(
//             (project) =>
//               `${project.path.split("/").pop()}<br/>${convertToByteUnits(
//                 project.amount
//               )}` // Display project name and XP
//           )
//           .join("<br/>");
//         tooltipHtml += "<br/>";
//       }

//       tooltip
//         .html(tooltipHtml)
//         .style("left", event.pageX + "px")
//         .style("top", event.pageY - 28 + "px");
//     })

//     .on("mouseout", function (d) {
//       tooltip.transition().duration(500).style("opacity", 0);
//     });
// }

export function createTimeline(data) {
  console.log("Creating timeline...");

  // Remove the previous timeline
  const timelineContainer = document.getElementById("timeline-container");
  timelineContainer.innerHTML = '';

  // Sort the timeline data by date
  data.data.user[0].timeline.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  // data = data.data.user[0].timeline.filter(item =>
  //   item.path.startsWith('/bahrain/bh-module/') && item.path !== '/bahrain/bh-module/checkpoint'
  // );
  // numberOfPaths = filteredData.length;
  // tempDataPath = filteredData;

  // Create a div for each project
  data.data.user[0].timeline.forEach(project => {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project-item';

    const projectName = document.createElement('span');
    projectName.textContent = project.path.split('/').pop(); // Get the last part of the path as the project name

    const projectButton = document.createElement('button');
    projectButton.textContent = project.path.includes('checkpoint') ? 'Checkpoint' : 'Project';
    projectButton.className = project.path.includes('checkpoint') ? 'checkpoint-btn' : 'project-btn';

    const projectXP = document.createElement('span');
    projectXP.textContent = `XP: ${convertToByteUnits(project.amount)}`;

    const projectDate = document.createElement('span');
    projectDate.textContent = new Date(project.createdAt).toLocaleDateString();

    projectDiv.appendChild(projectName);
    projectDiv.appendChild(projectButton);
    projectDiv.appendChild(projectXP);
    projectDiv.appendChild(projectDate);

    timelineContainer.appendChild(projectDiv);
  });
}

// Display the user XP and XP ratio in the DOM and generate the XP graph
export function displayUserXp(upAmount, downAmount) {
  console.log("Displaying user xp...");

  // calculate the audit ratio.
  const auditRatio = (upAmount / downAmount);

  // Display the user XP ratio
  let xpRatioElement = document.getElementById("xpRatio");
  if (xpRatioElement) {
    // Remove any existing canvas or SVG elements
    xpRatioElement.innerHTML = '';

    const width = 250; // increased width
    // const rect = xpRatioElement.getBoundingClientRect();
    // const width = rect.width; // Use the full width of the xpRatio element
    const height = 100; // increased height
    const margin = { top: 40, right: 40, bottom: 50, left: 100 }; // increased margins

    const svg = d3
      .select("#xpRatio")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand().range([0, height]).padding(0.3);

    const data = [
      { label: 'Received XP', value: downAmount },
      { label: 'Given XP', value: upAmount },
    ];

    x.domain([0, d3.max(data, (d) => d.value)]);
    y.domain(data.map((d) => d.label)).padding(0.1);

    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em");

    svg.append("g")
      .attr("transform", `translate(0, ${height})`) // move x-axis to the bottom
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-90)")  // rotate the text
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "-0.5em");

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => y(d.label))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d, i) => (i === 0 ? "rgba(54, 162, 235, 0.2)" : "rgba(255, 99, 132, 0.2)"))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", (d, i) => (i === 0 ? "rgb(54, 162, 235)" : "rgb(255, 99, 132)"));
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", (d, i) => (i === 0 ? "rgba(54, 162, 235, 0.2)" : "rgba(255, 99, 132, 0.2)"));
      });

    // Add a title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline");
    // .text("XP Ratio");

    // Display the audit ratio
    // const auditRatioElement = document.createElement('p');
    // auditRatioElement.textContent = `Audit Ratio: ${auditRatio.toFixed(2)}`;
    // xpRatioElement.appendChild(auditRatioElement);
  }

  let xpRatioElementtxt = document.getElementById("display-ratio");
  if (xpRatioElementtxt) {
    xpRatioElementtxt.textContent = `Audit Ratio: ${auditRatio.toFixed(2)}`;
  }

  // Display the user given XP
  let upXpValueElement = document.getElementById("upXpValue");
  if (upXpValueElement) {
    upXpValueElement.textContent = "Up XP: " + convertToByteUnits(upAmount);
  }

  // Display the user received XP
  let downXpValueElement = document.getElementById("downXpValue");
  if (downXpValueElement) {
    downXpValueElement.textContent = "Down XP: " + convertToByteUnits(downAmount);
  }

  const totalXP = upAmount + downAmount;
  const upXp = document.getElementById("upXp");
  const downXp = document.getElementById("downXp");

  if (upXp && downXp) {
    const upXpWidth = (upAmount / totalXP) * 100;
    const downXpWidth = (downAmount / totalXP) * 100;
    upXp.setAttribute("width", upXpWidth);
    upXp.setAttribute("x", 0);
    downXp.setAttribute("width", downXpWidth);
    downXp.setAttribute("x", upXpWidth);
  }
}

export async function displayUserInfo(user) {
  console.log("Displaying user info...");
  console.log(user);
  console.log(user.attrs.PhoneNumber);

  // Set the title of the page to the username of the user
  document.title = `${user.login}s Profile`;

  // Set the user image
  let imageElement = document.getElementById("user-image");
  if (imageElement) {
    imageElement.src = user.attrs.image;
  }

  // Set the user name
  let nameProfileElement = document.getElementById("name-profile");
  if (nameProfileElement) {
    nameProfileElement.textContent = `${user.login}'s Profile`;
  }

  // Set the user phone number
  let phoneElement = document.getElementById("phone");
  if (phoneElement) {
    phoneElement.textContent = `${user.attrs.PhoneNumber}`;
  }

  // Set the user email
  let emailElement = document.getElementById("email");
  if (emailElement) {
    emailElement.textContent = `${user.attrs.email}`;
  }

  // Set the user first name and last name
  let firstNameLastNameElement = document.getElementById("first-name-last-name");
  if (firstNameLastNameElement) {
    firstNameLastNameElement.textContent = ` ${user.attrs.firstName} ${user.attrs.lastName}`;
  }

  // Set the user first name and last name
  let LoginInUserElement = document.getElementById("wlcoming");
  if (LoginInUserElement) {
    LoginInUserElement.textContent = `Welcome ${user.login}!`;
  }

  // Set the user campus
  let campusElement = document.getElementById("campus");
  if (campusElement) {
    //     const totalXp = user.xpAmount.aggregate.sum.amount;
    // const level = calculateLevel(totalXp);
    campusElement.textContent = ` ${user.xpAmount.aggregate.sum.amount} at ${user.campus}`;

  }

  // Set the user age and country
  let fromElement = document.getElementById("from");
  if (fromElement) {
    fromElement.textContent = `${calculateAge(user.attrs.dateOfBirth)} Years old from ${user.attrs.country}`;
  }

  const userLevel = await fetchUserLevel(user.login);
  console.log("User level2:", userLevel);
  const levelText = displayUserLevel(userLevel);

  // Set the user level
  let levelElement = document.getElementById("level");
  if (levelElement) {
    levelElement.textContent = levelText;
  }
}

// Define your skill data
// export const skillData = [
//   { skill: "prog", value: 70 },
//   { skill: "algo", value: 60 },
//   { skill: "sys-admin", value: 50 },
//   { skill: "front-end", value: 40 },
//   { skill: "back-end", value: 60 },
//   { skill: "stats", value: 50 },
//   { skill: "ai", value: 30 },
//   { skill: "game", value: 20 },
//   { skill: "tcp", value: 50 }
// ];

// export const languageData = [
//   { skill: "go", value: 80 },
//   { skill: "js", value: 70 },
//   { skill: "html", value: 60 },
//   { skill: "css", value: 50 },
//   { skill: "unix", value: 40 },
//   { skill: "docker", value: 30 },
//   { skill: "sql", value: 70 },
//   { skill: "c", value: 50 },
//   { skill: "ruby", value: 60 },
//   { skill: "rails", value: 40 }
// ];

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

/**
Go
Js
Html
Css
Unix
Docker
Sql
C
Ruby
Rails
*/

function isProgrammingLanguage(skillName) {
  const programmingLanguages = ['go', 'js', 'html', 'css', 'unix', 'docker', 'sql', 'c', 'ruby', 'rails', 'java'];
  return programmingLanguages.includes(skillName);
}

export async function mySkills() {
  const { skills, languages } = await fetchSkillData();
  displayRadarChart(skills, 'skill-container');
  displayRadarChart(languages, 'language-container');
}

export function displayRadarChart(data, containerId) {
  console.log('data:', data, 'containerId:', containerId);
  // Remove the previous chart
  const skillContainer = document.getElementById(containerId);
  skillContainer.innerHTML = '';

  const width = 220;
  const height = 220;
  const radius = Math.min(width, height) / 2-10;

  const color = d3.scaleOrdinal().range(['#B19CD9']);

  const angleSlice = (Math.PI * 2) / data.length;


  const maxValue = d3.max(data, d => d.value);

  // Normalize the values to ensure they fit within the chart
  const normalizedData = data.map(d => ({
    skill: d.skill,
    value: (d.value / maxValue) * 100
  }));

  const svg = d3.select(`#${containerId}`)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);

  const ticks = rScale.ticks(5).filter((tick) => tick > 0);

  // Draw the grid circles
  const grid = svg
    .append('g')
    .attr('class', 'gridCircles')
    .selectAll('circle')
    .data(ticks)
    .enter()
    .append('circle')
    .attr('r', (d) => rScale(d))
    .style('fill', 'none')
    .style('stroke', '#ccc')
    .style('stroke-width', 1);

  // Draw the axes
  const axisGrid = svg
    .append('g')
    .attr('class', 'axisWrapper')
    .selectAll('.levels')
    .data(ticks)
    .enter()
    .append('g')
    .attr('class', 'levels');

  // Draw axis labels
  const axisLabel = svg
    .append('g')
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2) + 5)
    .attr('y', (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2) - 5)
    .text((d) => d.skill)
    .style('font-size', '14px')
    .style('fill', 'rgb(177, 156, 217)');

  // Draw the radar area
  const radarLine = d3.radialLine()
    .radius((d) => rScale(d.value))
    .angle((d, i) => i * angleSlice);

  svg.append("path")
    // .data(data)
    .data([normalizedData])
    .attr("class", "radarStroke")
    .attr("d", radarLine)
    .style("stroke-width", 2)
    .style("stroke", color(0))
    .style("fill", color(0))
    .style("fill-opacity", 0.5);

  // Draw the radar circles
  const dataPointWrapper = svg
    .selectAll('.radarCircle')
    // .data(data)
    .data(normalizedData)
    .enter()
    .append('g')
    .attr('class', 'radarCircle');

  dataPointWrapper
    .append('circle')
    .attr('r', 4)
    .style('fill', color(0))
    .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2));

  // Add more circles to ensure no dot is out of the graph
  // const numCircles = 10; // Adjust the number of circles as needed
  // const maxValue = d3.max(data, d => d.value); // Get the maximum value from the data
  // const adjustedRadius = radius * (maxValue / 100); // Adjust radius based on max value

  // for (let i = 1; i <= numCircles; i++) {
  //   svg.append("circle")
  //     .attr("r", (adjustedRadius / numCircles) * i)
  //     .attr("cx", 0)
  //     .attr("cy", 0)
  //     .style("fill", "none")
  //     .style("stroke", "#CDCDCD")
  //     .style("stroke-dasharray", "2,2");
  // }
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

export function calculateAge(dateOfBirthStr) {
  const dob = new Date(dateOfBirthStr);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs); // milliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970); // subtract 1970 to get the age in years
}

export function convertToByteUnits(num) {
  const units = ["bytes", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  while (num >= 1000 && i < units.length - 1) {
    num /= 1000;
    i++;
  }
  // remove decimals and round up to nearest integer
  num = Math.round(num);
  return `${num} ${units[i]}`;
}

export async function createGraph(VAriableName, query) {
  let tempDataPath = []
  let numberOfPaths = 0;

  try {
    const response = await fetch(
      Alphabet.A + "api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${VAriableName}`,
        },
        body: JSON.stringify({ query }),
      }
    );


    const data = await response.json();
    // Check if data.data and data.data.user exist
    if (!data.data.user || data.data.user.length === 0) {
      console.error("Error: data.data or data.data.user is undefined or empty.");
      return; // Exit the function if the data is not structured as expected
    }
    const user = data.data.user[0];
    displayUserInfo(user);
    displayUserXp(
      user.upAmount.aggregate.sum.amount,
      user.downAmount.aggregate.sum.amount
    );


    const filteredData = data.data.user[0].timeline.filter(item =>
      item.path.startsWith('/bahrain/bh-module/') && item.path !== '/bahrain/bh-module/checkpoint'
    );
    numberOfPaths = filteredData.length;
    tempDataPath = filteredData;

    // Display the user XP
    let lastSubmitProject = document.getElementById("last-submit");
    if (lastSubmitProject) {
      // Sort the tempDataPath array by createdAt date in ascending order
      tempDataPath.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // Get the latest entry
      const latestEntry = tempDataPath[tempDataPath.length - 1];

      const cleanedPath = latestEntry.path.replace('/bahrain/bh-module/', '');


      // Update the text content with the path of the latest entry
      lastSubmitProject.textContent = `${cleanedPath}`;
    }

    // get the size of the timeline-container
    const timelineContainer = document.getElementById("timeline-container");

    if (timelineContainer) {
      // create the timeline
      // createTimeline(
      //   timelineContainer.offsetWidth,
      //   timelineContainer.offsetHeight,
      //   data
      // );
      createTimeline(data);
      //  if the window is resized, re-create the timeline
      // const firstHeight = timelineContainer.offsetHeight;
      // window.addEventListener("resize", () => {
      //   createTimeline(timelineContainer.offsetWidth, firstHeight, data);
      // });
      const filteredData = data.data.user[0].timeline.filter(item =>
        item.path.startsWith('/bahrain/bh-module/') && item.path !== '/bahrain/bh-module/checkpoint'
      );
      numberOfPaths = filteredData.length;
      tempDataPath = filteredData;
    } else {
      console.error("Timeline container element not found.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  document.getElementById("past-event").innerText = numberOfPaths;

  // Calculate total amount
  let totalAmount = 0;
  tempDataPath.forEach(item => {
    totalAmount += item.amount;
  });

  // Prepare data for the chart
  // let chartData = {
  //   labels: tempDataPath.map(item => item.path.replace('/bahrain/bh-module/', '')),
  //   datasets: [{
  //     data: tempDataPath.map(item => item.amount),
  //   }]
  // };

  console.log(tempDataPath);


  //! Chart JS
  const chart = document.getElementById("doughnut");
  const eventList = document.querySelector(".chart ul");

  // new Chart(chart, {
  //   type: 'doughnut',
  //   data: chartData,
  //   options: {
  //     responsive: true,
  //     plugins: {
  //       legend: {
  //         display: true,
  //         labels: {
  //           color: "#8b8a96",
  //           font: {
  //             size: 12,
  //             weight: 600,
  //           },
  //         },
  //       },
  //     },
  //     layout: {
  //       padding: {
  //         bottom: 10,
  //       },
  //     },
  //   },
  // });
  // function population() {
  //   chartData.labels.forEach((label, i) => {
  //     let eachEvent = document.createElement("li");
  //     eachEvent.innerHTML = `${label}: <span class="percentage">${chartData[i].amount}/totalAmount*100%</span> `;
  //     eventList.appendChild(eachEvent);
  //   });
  // }

  // population();

  console.log('tempDataPath:', tempDataPath);

  let chartData = tempDataPath.map(item => {
    return {
      path: item.path.replace('/bahrain/bh-module/', ''),
      amount: item.amount
    };
  });

  console.log('chartData:', chartData);

  let width = 350,
    height = 350,
    margin = 50;

  let radius = Math.min(width, height) / 2 - margin;

  let svg = d3.select("#doughnut")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  // Generate colors for each item in chartData
  let colors = chartData.map(() => getRandomColor());

  let color = d3.scaleOrdinal()
    .domain(chartData.map(d => d.path))
    .range(colors);


  let pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.amount; });

  let arc = d3.arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);

  let outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  let pieData = pie(chartData);
  console.log('pieData:', pieData);

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll('allSlices')
    .data(pieData)
    .enter()
    .append('path')
    .attr('d', arc)
    // .attr('fill', function (d) { return (color(d.data.path)); })
    // .attr("stroke", "white")
    .attr('fill', 'none') // No fill
    .attr("stroke", function (d) { return (color(d.data.path)); }) // Border color
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
    .style("pointer-events", "all") // Add pointer events
    .on("mouseover", function (event, d) {
      d3.select(this).attr('fill', color(d.data.path)); // Fill on hover
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html("Project: " + d.data.path + "<br>Amount: " + d.data.amount)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px")
        .style("border", "2px solid " + color(d.data.path)) // Add border with color
      // .style("background", "none"); // Remove fill
    })
    .on("mouseout", function (d) {
      d3.select(this).attr('fill', 'none'); // Fill on hover
      tooltip.transition().duration(500).style("opacity", 0);
      // tooltip.style("border", "none"); // Remove border
    });

  // Custom Legend
  let legend = d3.select("#doughnut")
    .append("div")
    .attr("class", "legend");

  chartData.forEach((d, i) => {
    let legendItem = legend.append("div")
      .attr("class", "legend-item");

    legendItem.append("div")
      .attr("class", "legend-color")
      .style("background-color", colors[i]);

    legendItem.append("div")
      .attr("class", "legend-label")
      .text(d.path);
  });
}

/**
 * create a pie chart for the audits that the user did
 */

export async function myAudits(VAriableName) {
  console.log("Creating audit chart...");

  // Remove the previous chart
  const auditContainer = document.getElementById("audit-container");
  auditContainer.innerHTML = '';

  const failedAudits = await fetchFailedAudits(VAriableName);
  const passedAudits = await fetchPassedAudits(VAriableName);
  console.log("failedAudits:", failedAudits);
  console.log("passedAudits:", passedAudits);
  const data = [
    { label: 'Failed Audits', value: failedAudits },
    { label: 'Passed Audits', value: passedAudits },
  ];

  const width = 220;
  const height = 220;
  const radius = Math.min(width, height) / 2;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 }; // increased margins


  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(['#FF6B6B', '#4ECDC4']);

  const pie = d3.pie()
    .value(d => d.value);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  const svg = d3.select("#audit-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Create a div element for the tooltip
  const tooltip = d3.select("#audit-container")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(131, 135, 193, 0.4)")
    .style("padding", "5px 10px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  const arcs = svg.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label))
    .on('mouseover', function (event, d) {
      tooltip.style("opacity", 1);
      tooltip.html(`<strong>${d.data.label}:</strong> ${d.data.value}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 25) + "px");
    })
    .on('mousemove', function (event) {
      tooltip.style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 25) + "px");
    })
    .on('mouseout', function () {
      tooltip.style("opacity", 0);
    });

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle");
  // .text(d => `${d.data.label}: ${d.data.value}`);

  // Add a title
  svg.append("text")
    .attr("x", 0)
    .attr("y", -height / 2 + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold");
  // .text("Audit Performance");
}



export function displayUserLevel(level) {
  // if the user is between level 0 -10 return a string containing the level followed by "Aspiring Developer"
  if (level >= 0 && level < 10) {
    return `Level ${level} Aspiring Developer`;
  }
  if (level >= 10 && level < 20) {
    return `Level ${level} Beginner Developer`;
  }
  if (level >= 20 && level < 30) {
    return `Level ${level} Apprentice Developer`;
  }
  if (level >= 30 && level < 40) {
    return `Level ${level} Assistant Developer`;
  }
  if (level >= 40 && level < 50) {
    return `Level ${level} Basic Developer`;
  }
  if (level >= 50 && level < 60) {
    return `Level ${level} Junior Developer`;
  } else {
    return `Level ${level}`;
  }
}

export function calculateLevel(xp) {
  const levels = [
    { xp: 0, level: 0 },
    { xp: 1000, level: 1 },
    { xp: 2000, level: 2 },
    { xp: 3000, level: 3 },
    // Add more level thresholds as needed
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xp) {
      return levels[i].level;
    }
  }

  return 0;
}

// Random color generator
export function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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



{/* <div className="flex-min-h-screen">
<h1 id="name-profile" className="my-4">Profile</h1>
<section className="profile-info">
  <h2 id="first-name-last-name" className="my-4">Name</h2>
  <p id="email" className="my-4">Email</p>
  <p id="from" className="my-4">From</p>
  <p id="phone" className="my-4">Phone</p>
</section>
<section className="profile-info">
  <div id="text-info">
    <h3 id="campus">Campus</h3>
  </div>
</section>
<section className="profile-info">
  <p id="total-xp">total xp</p>
</section>
<section className="profile-info">
  <div className="user-image-container">
    <img alt="User Image" id="user-image" />
  </div>
</section>
<section className="statistics">
  <h2>Statistics</h2>
  <div className="xp-widget">
    <div className="xp-container">
      <div className="xp-ratio-display" id="xpRatio"></div>
      <div className="xp-values-display">
        <div className="xp-value">
          <p className="xp-value-label" id="upXpValue">Up XP:</p>
        </div>
        <div className="xp-value">
          <p className="xp-value-label" id="downXpValue">Down XP:</p>
        </div>
      </div>
      <div className="xp-visualization">
        <svg className="xp-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
          <rect className="xp-bar xp-up" id="upXp" x="0" y="0" width="50" height="20"></rect>
          <rect className="xp-bar xp-down" id="downXp" x="50" y="0" width="50" height="20"></rect>
        </svg>
      </div>
    </div>
  </div>
</section>
</div> */}

