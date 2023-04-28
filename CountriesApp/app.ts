const express = require('express');
const path = require('path');
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';


const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/graphql",
  cache: new InMemoryCache(),
});

const app = express();

// wwwroot klasörü içindeki statik dosyaların yolu
const staticFilesPath = path.join(__dirname, 'wwwroot');

// wwwroot klasörünü statik dosya klasörü olarak tanımla
app.use(express.static(staticFilesPath));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
      const { data } = await client.query({
        query: gql`
          query GetCountries {
            countries {
              name
              code
              capital
              emoji
              continent {
                name
                code
              }
              languages {
                name
              }
            }
          }
        `,
      });
  
      res.render('index', { countries: data.countries });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

app.get('/countries', async (req, res) => {
  try {
    const { data } = await client.query({
      query: gql`
        query GetCountries {
          countries {
            name
            code
            capital
            emoji
            continent {
                name
                code
              }
          }
        }
      `,
    });

    res.json(data.countries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(4000, () => {
  console.log('API running on http://localhost:4000/countries');
});
