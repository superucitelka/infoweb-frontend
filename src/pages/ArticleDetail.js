/* Import základní knihovny Reactu */
import React from "react";
/* Import metody useParams z modulu react-router-dom. (viz https://reactrouter.com/docs/en/v6/hooks/use-params) */
import { useParams } from "react-router-dom";

/* Export funkce ArticleDetail(), která představuje komponentu pro výpis podrobností o jednom článku. */
export default function Articles() {
  /* Do konstanty id se uloží parametr zadaný na konec URL požadavku - číselné id vybraného článku. */
  /* metodu useParams() označujeme v Reactu jako tzv. hook (viz https://www.w3schools.com/react/react_hooks.asp) */
  const { id } = useParams();
  return (
    <div>
      {/* V nadpisu se zatím zobrazí id předané v URL požadavku */}
      <h2>Výpis článku s id={ id }</h2>
      <p>Tady budou zobrazeny podrobnosti o jednom článku</p>
    </div>
  );
}
