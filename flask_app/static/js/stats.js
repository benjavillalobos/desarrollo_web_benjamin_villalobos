
crearGraficos = (datos) => {
  //grafico 1
  Highcharts.chart("grafico_lineas", {
    chart: { type: "line", backgroundColor: "#0f172a" },
    title: { text: "Número de Avisos de Adopción por Día", style: { color: "#e2e8f0" } },
    xAxis: { categories: datos.por_dia.map(d => d.fecha), title: { text: "Fecha" } },
    yAxis: { title: { text: "Avisos" } },
    series: [{ name: "Avisos", data: datos.por_dia.map(d => d.total), color: "#3b82f6" }]
  });

  //grafcio 2
  Highcharts.chart("grafico_torta", {
    chart: { type: "pie", backgroundColor: "#0f172a" },
    title: { text: "Distribución por Tipo de Mascota", style: { color: "#e2e8f0" } },
    series: [{
      name: "Total",
      colorByPoint: true,
      data: datos.por_tipo.map(t => ({ name: t.tipo, y: t.total }))
    }]
  });

  //grafico 3
  Highcharts.chart("grafico_barras", {
    chart: { type: "column", backgroundColor: "#0f172a" },
    title: { text: "Avisos por Mes y Tipo de Mascota", style: { color: "#e2e8f0" } },
    xAxis: { categories: datos.por_mes.map(d => d.mes) },
    yAxis: { title: { text: "Avisos" } },
    series: [
      { name: "Perros", data: datos.por_mes.map(d => d.perros || 0), color: "#3b82f6" },
      { name: "Gatos", data: datos.por_mes.map(d => d.gatos || 0), color: "#f472b6" }
    ]
  });
};
//obtener datos del Flask
fetch(`${window.origin}/api/estadisticas`)
  .then(resp => resp.json())
  .then(data => crearGraficos(data))
  .catch(err => console.error("Error al cargar estadísticas:", err));