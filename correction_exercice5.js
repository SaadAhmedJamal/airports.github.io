async function createVisualizations() {
  // ---- DATA LOADING ----- //

  //const airportsEmissionFr = await aq.load("data/emissionsfr@1.csv", { using: aq.fromCSV }); 
  //var airportsEmissionFr = await aq.load("data/emissionsfr@1.csv".text(), { using: aq.fromCSV }); 

  var airports = await aq.loadCSV('data/airports.csv');
//  var airportsEmissionFr = await aq.loadCSV('data/emissionsfr@1.csv');

 console.log(airports);

  // EXERCISES
  createVisualizationsQ5(airports);
}

function createVisualizationsQ5(airports) {


  var selection5 =  {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 300,
    "height": 300,
    "projection": {
      "type": "orthographic",
      "rotate": {"expr": "[rotate0, rotate1, 0]"}
    },
    "params": [
      {
        "name": "rotate0",
        "value": 0,
        "bind": {"input": "range", "min": -90, "max": 90, "step": 1}
      },
      {
        "name": "rotate1",
        "value": 0,
        "bind": {"input": "range", "min": -90, "max": 90, "step": 1}
      },
      {
        "name": "Point_Size",
        "value": 0.8,
        "bind": {"input": "range", "min": 0, "max": 2, "step": 0.1}
      }
    ],
    "layer": [
      {
        "data": {"sphere": true},
        "mark": {"type": "geoshape", "fill": "aliceblue"}
      },
      {
        "data": {
          "name": "world",
          "url": "data/world-110m.json",
          "format": {"type": "topojson", "feature": "countries"}
        },
        "mark": {"type": "geoshape", "fill": "mintcream", "stroke": "black"}
      },
      {
         "data": {

          values: airports.objects(),
/*
          "name": "airports",
          "url": "data/airports.csv",
          "format": {"type": "csv", "property": "features"}
                              */

        
        },
        "transform": [
          //{"calculate": "datum.geometry.coordinates[0]", "as": "longitude"},
          //{"calculate": "datum.geometry.coordinates[1]", "as": "latitude"},
          //{
          //  "filter": "(rotate0 * -1) - 90 < datum.longitude && datum.longitude < (rotate0 * -1) + 90 && (rotate1 * -1) - 90 < datum.latitude && datum.latitude < (rotate1 * -1) + 90"
          //},
          //{"calculate": "datum.properties.mag", "as": "magnitude"}
        ],
        "mark": {"type": "circle", "color": "red", "opacity": 0.25},
        "encoding": {
          "longitude": {"field": "longitude_deg", "type": "quantitative"},
          "latitude": {"field": "latitude_deg", "type": "quantitative"},
          "size": {
            "legend": null,
            "field": "elevation_ft",
            "type": "quantitative",
            "scale": {
              "type": "sqrt",
              "domain": [0, 100],
              "range": [0, {"expr": "pow(Point_Size, 3)"}]
            }
          },
          "tooltip": [{"field": "name"},
        
          {"field": "type"},
          {"field": "iso_country"},
          {"field": "local_code"}
        
        
        ]
        }
      }
    ]
  };
  
  
  
  
  vegaEmbed("#selection_5", selection5);

}

createVisualizations();




/*

  {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 900,
    height: 400,
    

    layer: [
      {
        data: {
          //url: "https://mjlobo.github.io/teaching/eivp/departements.json",
          url: "data/departements.json",
          format: {
            type: "topojson",
            feature: "departements",
          },
        },
        projection: {
          type: "orthographic",
          "rotate": {"expr": "[rotate0, rotate1, 0]"
          }
        },
        mark: {
          type: "geoshape",
          fill: "lightgray",
          stroke: "white",
        },
      },
      {
        params: [
          {
            name: "selected", //the variable that will stock the selected object
            select: { type: "point", on: "mouseover" }, //selection mechanism, here we use the point based selection when the mouse is over the point
          },

        ],

        data: {
          values: airports.objects(),
        },




        projection: {
          type: "mercator",
        },
        mark: {
          type: "circle",
          tooltip: true,
        },
        encoding: {
          longitude: {
            field: "longitude_deg",//"X_WGS84",
            type: "quantitative",
          },
          latitude: {
            field: "latitude_deg",//"Y_WGS84",
            type: "quantitative",
          },

          tooltip: [{ field: "name", type: "nominal",},
                    {field: "type", type: "nominal"},
                    {field: "iso_country", type: "nominal"}


                      
                      //, {field: "DEPARTEMEN", type: "nominal"}
                      //{field: "", type: "quantitative"}
                    ],
          size: {
           
            
            value: 800,
          },
          color: { 
          condition: { param: "selected", value: "green", empty: false },
          //"field": "total_CO2" , "type":"quantitative",
          value: "steelblue", 
          },
            
          //"size": {"value": 1},
          //"color": {"field": "digit", "type": "nominal"}

        },
      },
    ],
  };

*/
