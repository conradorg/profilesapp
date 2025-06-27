import { useState, useEffect } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { generateClient } from "aws-amplify/data";
import { updateUserProfile } from "../amplify/auth/post-confirmation/graphql/mutations";

import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  // counters
  const [count, setCount] = useState(0)
  const [prime, setPrime] = useState(2)

  // user profile
  const [userprofiles, setUserProfiles] = useState([]);
  const { signOut } = useAuthenticator((context) => [context.user]);
  const [age, setAge] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);

    if (profiles.length === 1) {
      setAge(profiles[0].age ?? -1);
    }

  }

  async function handleSave(userprofile, newAge) {
  if (newAge === undefined || newAge === '') return;

  const response = await client.graphql({
    query: updateUserProfile,
    variables: {
      input: {
        id: userprofile.id,
        age: newAge,
      },
    },
  });
  console.log('GraphQL response:', response);
  console.log('1) userprofile.age', userprofile.age)

  await fetchUserProfile(); // Refresh the list
  console.log('2) userprofile.age', userprofile.age)
}

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p className="read-the-docs">
        There are two buttons, one for counting and one for finding the next prime number. <br />
        Try it out!
      </p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <button onClick={() => setPrime(nextPrimeNumber(prime))}>
        prime is {prime}
      </button>

      <br />
      <Divider />

      <Heading level={1}>My Profile</Heading>

      <Divider />

      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {userprofiles.map((userprofile) => (
          <Flex
            key={userprofile.id || userprofile.email}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="1px solid #ccc"
            padding="2rem"
            borderRadius="5%"
            className="box"
          >
            <View>
              <Heading level="3">{userprofile.email}</Heading>
            </View>
            Age:
            <input
              id="age"
              type="number"
              value={age === '' ? '' : String(age)}
              onChange={(e) =>
                setAge(e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="please add your age"
            />
            <button onClick={() => handleSave(userprofile, age)}>Save</button>
          </Flex>
        ))}
      </Grid>
      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}


function nextPrimeNumber(x) {
  let found = false;

  if (x > 200) {
    return 2;
  }

  while (!found) {
    x++;
    found = true;
    for (let i = 2; i <= Math.sqrt(x); i++) {
      if (x % i === 0) {
        found = false;
        break;
      }
    }
  }
  return x;
}