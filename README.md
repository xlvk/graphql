# graphQL

The objective of this project is to learn the GraphQL query language, by creating your own profile page.

#### Thiscodeisresponsiblefor rendering the user profile page and displaying various charts and information related to the user's performance, skills, and progress. Here are the key features and functionalities included in this code:

1. **User Authentication**: The code checks if the user is logged in by verifying the presence of a JWT token in the local storage. If the user is not logged in, they are redirected to the login page.
2. **User Information Display**: The code fetches and displays the user's first name, last name, and login information on the profile page.
3. **User Level Display**: The code fetches the user's level from the server and displays it on the profile page. The level is accompanied by a descriptive label based on the user's progress (e.g., "Aspiring Developer,""Beginner Developer," etc.).

4. **XPandAuditRatioDisplay**: The code calculates and displays the user's XP ratio (the ratio of XP received to XP given) and the audit ratio (the ratio of passed audits to failed audits). These ratios are visualized using D3.js bar charts.

5. **Last Submitted Project Display**: The code fetches and displays the path of the user'slastsubmitted project.

6. **SkillandLanguagePerformanceCharts**: The code fetches the user's skill and language data from the server and renders radar charts to visualize the user'sperformanceineachskillandlanguageusingD3.js.

7. **AuditPerformanceChart**: The code fetches the number ofpassedandfailedauditsfor the user and displays a pie chart to visualize the audit performance using D3.js.

8. **XP per Project Chart**: The code fetches the user's timeline data, which includes the XP earned for each project. It then renders a donut chart using D3.js to visualize the XP earned per project, with a custom legend and tooltip.
9. **Submitted and In-Progress Projects Display**: The code fetches and displays the number of submitted projects and projects in progress for the user.
10. **Utility Functions**: The code includes various utility functions for fetching data from the server, displaying user levels, generating random colors, and more.

Overall, this code provides a comprehensive view of the user's progress, performance, and achievements within the application, leveraging various data visualization techniques and libraries like D3.js and Chart.js.
