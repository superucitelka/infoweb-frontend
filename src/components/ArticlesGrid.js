/* Import základní knihovny Reactu */
import React from "react";
/* Import použitých komponent z knihovny react-bootstrap */
import { Container, Row, Col, Alert, Figure, Button } from "react-bootstrap";
/* Import nástrojů pro práci s graphQL z knihovny @apollo/client (viz https://www.apollographql.com/docs/react/get-started/) */
import { gql, useQuery } from "@apollo/client";

/* Konstanta s vytvořeným graphQL dotazem, pomocí něhož získáme informace o všech uložených článcích. */
const ARTICLES = gql`
  query Articles {
    articles {
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
                icon {
                  data {
                    attributes {
                      url
                    }
                  }
                }
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
        }
      }
    }
  }
`;

/* Komponenta ArticleGrid pro zobrazení seznamu článků v rámci Bootstrap gridu */
export const ArticlesGrid = () => {
  /* Odeslání graphQL dotazu pomocí hook funkce useQuery() 
     Výsledkem mohou být tři stavy vyjádřené v konstantách loading, error, data */

  const { loading, error, data } = useQuery(ARTICLES);
  /* Situace, kdy jsou načítána data z backend serveru. */
  if (loading) return <p>Probíhá načítání stránky...</p>;
  /* Situace, kdy došlo k chybě během načítání dat. */
  if (error) return (
    <Container>
      <Alert variant="danger">Došlo k chybě: {JSON.stringify(error)}</Alert>
    </Container>
  );
  /* Dotaz byl úspěšně proveden a v odeslaných datech je aspoň 1 článek: */
  if (data.articles.data.length > 0)
    return (
      <Container fluid>
        <Row sm={1} md={2} lg={3}>
          {/* K postupnému výpisu všech datových objektů v poli lze efektivně použít metodu map ( viz https://www.w3schools.com/js/js_es5.asp#mark_array_map). 
                Jednotlivé objekty v poli jsou postupně předány do proměnné article a pomocí ní lze přistupovat k dílčím datovým atributům. */}
          {data.articles.data.map((article) => (
            /* Každý opakující se prvek by měl obsahovat atribut key s přiřazeným jedinečným klíčem k datovému objektu. */
            <Col key={article.id}>
              <div className="border p-2 m-2">
                {/* Zobrazení titulku článku v nadpisu. */}
                <h3>{article.attributes.title}</h3>
                {/* V případě, že k článku existuje doprovodný obrázek ... */}
                {article.attributes.image.data && (
                  <Figure>
                    {/* ... použije se spojení adresy webu s cestou k danému obrázku, která je uložena v databázi backendu. */}
                    <Figure.Image
                      alt={article.attributes.title}
                      src={`${process.env.REACT_APP_BACKEND_URL}${article.attributes.image.data.attributes.url}`}
                      rounded
                    />
                    <Figure.Caption>
                      Obrázek: {article.attributes.title}
                    </Figure.Caption>
                  </Figure>
                )}
                {/* V případě, že k článku není žádný doprovodný obrázek ... */}
                {!article.attributes.image.data && (
                  <Figure>
                    {/* ... zobrazí se náhrada v podobě školního loga */}
                    <Figure.Image
                      alt={article.attributes.title}
                      src="/skola-logo.png"
                      rounded
                    />
                    <Figure.Caption>Obrázek: Není k dispozici</Figure.Caption>
                  </Figure>
                )}
                {/* Zobrazí se 100 prvních znaků z obsahu článku. */}
                <p>{article.attributes.content.substring(0, 100)}...</p>
                {/* Komponenta Button umožní zobrazení stránky s podrobnostmi k danému článku. */}
                <Button
                  variant="outline-primary"
                  href={`/articles/${article.id}`}
                >
                  Podrobnosti
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    );
  /* Dotaz byl úspěšně proveden, ale v odeslaných datech není žádný článek: */ else
    return (
      <Container>
        <Alert variant="warning">Nebyl nalezen žádný článek</Alert>
      </Container>
    );
};
