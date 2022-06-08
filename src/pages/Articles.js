/* Import základní knihovny Reactu */
import React from "react";
import { ArticlesGrid } from './../components/ArticlesGrid';

/* Export funkce Articles(), která představuje komponentu pro výpis seznamu článků */
export default function Articles() {
  return (
    /* Kód v jazyce JSX musí obsahovat kořenový element - v tomto případě oddíl div */
    <div>
      <h2 className="text-danger bg-light p-3 m-3 text-center">Seznam článků</h2>
      <ArticlesGrid />
    </div>
  );
}
