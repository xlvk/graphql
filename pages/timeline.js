import { LoadNav, navBarItems } from "../funcs/navbar";
import * as d3 from 'd3';
import { Alphabet } from "../funcs/MyAlphabet";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { displayUserXp } from "./profile";

/**@
 * This function fetches the profile page
 */

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
export const TimeLine = async () => {
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
    <!-- <div class="left-content"> -->

      <div class="reviews">
        <h1 id="wlcoming"></h1>
        <div class="review-container">

          <div class="card review-card">
            <h2>The TimeLine:</h2>
            <script src="https://d3js.org/d3.v7.min.js" async></script>
      <div id="timeline-container">
        <svg id="timeline"></svg>
      </div>
          </div>
        </div>
      </div>
    <!-- </div> -->
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

    console.log(Alphabet.N);

    //! create this function to create the graph and the Timeline for the user
    createGraph(VAriableName, query);
};

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
        const user = data.data.user[0];
        displayUserInfo(user);
        displayUserXp(
            user.xpAmount.aggregate.sum.amount,
            user.upAmount.aggregate.sum.amount,
            user.downAmount.aggregate.sum.amount
        );

        // get the size of the timeline-container
        const timelineContainer = document.getElementById("timeline-container");

        if (timelineContainer) {
            // create the timeline
            createTimeline(
                timelineContainer.offsetWidth/1.5,
                timelineContainer.offsetHeight,
                data
            );
            //  if the window is resized, re-create the timeline
            const firstHeight = timelineContainer.offsetHeight;
            window.addEventListener("resize", () => {
                createTimeline(timelineContainer.offsetWidth, firstHeight, data);
            });
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

    let color = d3.scaleOrdinal()
        .domain(chartData.map(d => d.path))
        .range(d3.schemeDark2);

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
        // .attr('fill', function(d){ return(color(d.data.path)); })
        // .attr("stroke", "white")
        .attr('fill', 'none') // No fill
        .attr("stroke", function (d) { return (color(d.data.path)); }) // Border color
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .style("pointer-events", "all") // Add pointer events
        .on("mouseover", function (event, d) {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
                .html("Project: " + d.data.path + "<br>Amount: " + d.data.amount)
                .style("left", event.pageX + "px")
                .style("top", event.pageY - 28 + "px")
                .style("border", "2px solid " + color(d.data.path)) // Add border with color
            // .style("background", "none"); // Remove fill
        })
        .on("mouseout", function (d) {
            tooltip.transition().duration(500).style("opacity", 0);
            // tooltip.style("border", "none"); // Remove border
        });
}

export function createTimeline(thicc, smoll, data) {
    console.log("Creating timeline...");
    // remove the previous timeline
    d3.select("#timeline").selectAll("*").remove();
    d3.select(".tooltip").remove();

    // sort the timeline data by date
    data.data.user[0].timeline.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    // get the start and end date of the timeline
    const startDate = new Date(data.data.user[0].timeline[0].createdAt);
    const endDate = new Date(
        data.data.user[0].timeline[data.data.user[0].timeline.length - 1].createdAt
    );

    // set the start and end date to the first and last day of the month in order to get the correct width of the timeline
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    endDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setHours(0, 0, 0, 0);

    // set the margins and width and height of the timeline
    const margin = { top: 20, right: 40, bottom: 40, left: 60 },
        width = thicc - margin.left - margin.right,
        height = smoll - margin.top - margin.bottom;

    // create a new svg element with the width and height of the timeline-container
    const svg = d3
        .select("#timeline")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().domain([startDate, endDate]).range([0, width]);
    if (thicc < 800 && thicc > 600) {
        svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(
                d3
                    .axisBottom(x)
                    .ticks(d3.timeMonth.every(1))
                    .tickFormat(d3.timeFormat("%b %Y"))
            );
    } else if (thicc < 600 && thicc >= 500) {
        svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(
                d3
                    .axisBottom(x)
                    .ticks(d3.timeMonth.every(1))
                    .tickFormat(d3.timeFormat("%b %y"))
            );
    } else if (thicc < 500 && thicc > 0) {
        svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(
                d3
                    .axisBottom(x)
                    .ticks(d3.timeMonth.every(1))
                    .tickFormat(d3.timeFormat("%b"))
            );
    } else {
        svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(
                d3
                    .axisBottom(x)
                    .ticks(d3.timeMonth.every(1))
                    .tickFormat(d3.timeFormat("%B %Y"))
            );
    }

    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("left", "50%") // Set initial left position
        .style("top", "0"); // Set initial top position

    const mergeOverlappingDots = (data) => {
        let mergedData = [];
        let tempData = [];

        data.forEach((item, i) => {
            if (i === 0) {
                tempData.push(item);
            } else if (
                Math.abs(
                    x(new Date(data[i - 1].createdAt)) - x(new Date(item.createdAt))
                ) < 6
            ) {
                tempData.push(item);
            } else {
                mergedData.push(tempData);
                tempData = [item];
            }
        });

        mergedData.push(tempData);
        return mergedData;
    };

    const mergedData = mergeOverlappingDots(data.data.user[0].timeline);

    const colorScale = d3
        .scaleLinear()
        .domain([0, d3.max(data.data.user[0].timeline, (d) => d.amount)])
        .range(["#3366cc", "#cc3366"]);

    svg
        .selectAll(".dot")
        .data(mergedData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", (d) => 5)
        .attr("cx", (d) => x(new Date(d[0].createdAt)))
        .attr("cy", height)
        .attr("fill", (d) => colorScale(d[0].amount)) // Fill dots with color based on amount
        .on("mouseover", function (event, d) {
            tooltip.transition().duration(200).style("opacity", 0.9);

            let tooltipHtml = "";

            // Group projects by date
            let dateGroupedProjects = d.reduce((group, project) => {
                let date = d3.timeFormat("%B %d, %Y")(new Date(project.createdAt));
                if (!group[date]) group[date] = [];
                group[date].push(project);
                return group;
            }, {});

            // Generate tooltip HTML

            for (let date in dateGroupedProjects) {
                tooltipHtml += `${date}<br/>`;
                tooltipHtml += dateGroupedProjects[date]
                    .map(
                        (project) =>
                            `${project.path.split("/").pop()}<br/>${convertToByteUnits(
                                project.amount
                            )}` // Display project name and XP
                    )
                    .join("<br/>");
                tooltipHtml += "<br/>";
            }

            tooltip
                .html(tooltipHtml)
                .style("left", event.pageX + "px")
                .style("top", event.pageY - 28 + "px");
        })

        .on("mouseout", function (d) {
            tooltip.transition().duration(500).style("opacity", 0);
        });
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
        LoginInUserElement.textContent = `welcome ${user.login}!`;
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

