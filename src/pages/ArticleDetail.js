/* Import základní knihovny Reactu */
import React from "react";
/* Import metody useParams z modulu react-router-dom. (viz https://reactrouter.com/docs/en/v6/hooks/use-params) */
import { useParams } from "react-router-dom";
/* Import použitých komponent z knihovny react-bootstrap */
import { Row, Col, Figure, ListGroup } from "react-bootstrap";
/* Import nástrojů pro práci s graphQL z knihovny @apollo/client (viz https://www.apollographql.com/docs/react/get-started/) */
import { gql, useQuery } from "@apollo/client";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

/* Konstanta s vytvořeným graphQL dotazem, pomocí něhož získáme informace o všech uložených článcích. */
const ARTICLE = gql`
  query Article($id: ID!) {
    article(id: $id) {
      data {
        id
        attributes {
          title
          content
          likes
          dislikes
          releasedAt
          categories {
            data {
              id
              attributes {
                name
                shortname
              }
            }
          }
          image {
            data {
              attributes {
                url
              }
            }
          }
          users_permissions_user {
            data {
              attributes {
                username
                email
              }
            }
          }
        }
      }
    }
  }
`;

/* Export funkce ArticleDetail(), která představuje komponentu pro výpis podrobností o jednom článku. */
export default function Articles() {
  /* Do konstanty id se uloží parametr zadaný na konec URL požadavku - číselné id vybraného článku. */
  /* metodu useParams() označujeme v Reactu jako tzv. hook (viz https://www.w3schools.com/react/react_hooks.asp) */
  const { id } = useParams();
  /* Odeslání graphQL dotazu pomocí hook funkce useQuery() 
     Výsledkem mohou být tři stavy vyjádřené v konstantách loading, error, data */
  const { loading, error, data } = useQuery(ARTICLE, { variables: { id: id } });
  /* Situace, kdy jsou načítána data z backend serveru. */
  if (loading) return <p>Probíhá načítání stránky...</p>;
  /* Situace, kdy došlo k chybě během načítání dat. */
  if (error) return <p>Došlo k chybě: {JSON.stringify(error)}</p>;
  /* Data jsou úspěšně načtena a uložena do konstanty article */
  const article = data.article.data;
  /* Tímto způsobem si můžeme do konstanty realeaseDate připravit datum publikování článku tak, aby se zobrazovalo v obvyklé "české" podobě.
     Metoda split() je použita k tomu, aby z řetězce "ROK-MĚSÍC-DEN" vytvořila pole [ROK, MĚSÍC, DEN], z něhož je vytvořen nový datový objekt.
     Metoda toLocaleDateString() vypíše datum v podobě, které odpovídá místním zvyklostem (dle nastavení OS). */
  const releasedDate = new Date(article.attributes.releasedAt.split("-")).toLocaleDateString();
  return (
    <Row>
      {/* V nadpisu se zobrazí titulek */}
      <h2 className="text-danger bg-light p-3 m-3 text-center">
        {article.attributes.title}
      </h2>
      {/* V odstavci pod nadpisem se zobrazí dostupné informace o autorovi článku (nick a email) a připojí se připravené datum publikování. */}
      <p className="small text-center text-secondary mb-4">
        Autor:{" "}
        <b>
          {article.attributes.users_permissions_user.data.attributes.username}
        </b>{" "}
        ({article.attributes.users_permissions_user.data.attributes.email}),
        publikováno: <b>{releasedDate}</b>
      </p>
      <Col>
        {/* Protože bylo k formátování obsahu článku použito ve Strapi RichText editoru umožňujícího úpravu textu s využitím značek formátu MD (MarkDown), 
            který je známý např. z gitu (README.md), k správnému zobrazování upravených částí textu použijeme externí komponentu ReactMarkdown a plugin
            remarkGfm (obojí je třeba nejprve nainstalovat: npm install react-markdown remark-gfm). Nesmíme je zapomenout importovat. */}
        <ReactMarkdown
          children={article.attributes.content}
          remarkPlugins={[remarkGfm]}
        />
      </Col>
      <Col>
        {/* V případě, že k článku existuje doprovodný obrázek ... */}
        {article.attributes.image.data && (
          <Figure>
            {/* ... použije se spojení adresy webu uložené v souboru .env v konstantě REACT_APP_BACKEND_URL s cestou k danému obrázku, která je uložena v databázi backendu. */}
            <Figure.Image
              alt={article.attributes.title}
              src={`${process.env.REACT_APP_BACKEND_URL}${article.attributes.image.data.attributes.url}`}
              rounded
            />
            {/* K popisu pod obrázkem použijeme titulek článku. */}
            <Figure.Caption>Obrázek: {article.attributes.title}</Figure.Caption>
          </Figure>
        )}
        <h4 className="bg-danger text-white p-3">Předměty</h4>
        {/* React-bootstrap komponentu ListGroup (viz https://react-bootstrap.github.io/components/list-group/) použijeme k vypsání všech předmětů/kategorií,
            do nichž byl článek zařazen. */}
        <ListGroup variant="flush">
          {/* Opět k tomu využijeme metody map, díky níž jsou opakovaně vloženy položky seznamu s názvy kategorií/předmětů. */}
          { article.attributes.categories.data.map(category => (
              <ListGroup.Item>{category.attributes.name}</ListGroup.Item>
            ))
          }
        </ListGroup>
      </Col>
    </Row>
  );
}
