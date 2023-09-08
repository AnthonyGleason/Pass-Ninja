# Pass-Ninja

Pass Ninja is a feature-rich, user-friendly password manager designed from scratch. It focuses on enhanced security by employing two-factor authentication and bcrypt for vault protection. In addition, each individual password is further secured with AES encryption, utilizing keys derived from the user's master password.

What sets Pass Ninja apart is its simplicity and accessibility, making it an excellent choice for individuals who may find traditional password managers overly complex. It enables users to effortlessly connect their vaults to their preferred two-factor authentication platform by scanning a QR Code generated within their vault settings and verifying their access to their authenticator. Additionally, Pass Ninja serves as an educational tool, promoting good password security practices. Users can easily access helpful explanations of terms and features by clicking on any underlined text throughout the website.

Pass Ninja also notifies users of recommended password updates and generates a vault health bar to assess their overall vault security.

<h3>Live Demo: <a href='https://anthonygleason.github.io/Pass-Ninja/'>Press Here</a></h3>
<h2>Tech Stack:</h2>
<h3>Front-end:</h3>
  <span>
    <img alt="React" height=40rem width=40rem src="https://api.iconify.design/logos/react.svg?download=1" />
    <img alt="TypeScript" height=40rem width=40rem src="https://api.iconify.design/logos/typescript-icon.svg?download=1" />
  </span>
  <br/>
  React.js, Typescript
<h3>Back-end:</h3>
  <span>
    <img alt="nodejs" height=40rem width=40rem src="https://api.iconify.design/vscode-icons/file-type-node.svg?download=1" />
    <img alt='express' height=40rem width=40rem src="https://api.iconify.design/skill-icons/expressjs-dark.svg?download=1" />
    <img alt="TypeScript" height=40rem width=40rem src="https://api.iconify.design/logos/typescript-icon.svg?download=1" />
    <img alt='heroku' height=40rem width=40rem src="https://api.iconify.design/skill-icons/heroku.svg?download=1" />
  </span>
  <br/>
  Node.js, Express, Typescript, Heroku
<br/><br/>

<h2>Local Installation Instructions:</h2>
<ol>
  <li>Clone this repository.</li>
  <li>Install required dependencies by running the command <code>npm run install</code> in both the client and server folders.</li>
  <li>After dependencies install, you can then run the command <code>npm run start</code> in both the client and server folders to run the client and server locally.</li>
  <li>The client will run at <code>localhost</code> port 3000 and connect to the server at <code>localhost</code> port 5000 by default. If you would like to use my server hosted on Heroku, you can modify your client by navigating to the file located at <code>client/src/clientSettings.tsx</code> and changing the line <code>const USE_LOCALHOST = true;</code> to <code>const USE_LOCALHOST = false;</code>.
  </li>
</ol>
<p></p>

<h2>Screenshots:</h2>
