async function createVisualizations() {
  // ---- DATA LOADING ----- //

  //const airportsEmissionFr = await aq.load("data/emissionsfr@1.csv", { using: aq.fromCSV }); 
  //var airportsEmissionFr = await aq.load("data/emissionsfr@1.csv".text(), { using: aq.fromCSV }); 

  var airportsEmissionsFr = await aq.loadCSV('data/emissionsfr@1.csv');
  console.log(airportsEmissionsFr);
//  var airportsEmissionFr = await aq.loadCSV('data/emissionsfr@1.csv');

  var airportsEmissionsFrwithdate = airportsEmissionsFr.derive({
    date: (d) => op.datetime(d.year, d.month - 1),
  });


  var EmissionsPerAirport = airportsEmissionsFrwithdate.groupby("APT").rollup({
    total_CO2 : (d) => op.sum(d.CO2),
    total_NOX : (d) => op.sum(d.NOX),
    APT_LAT: (d)=> op.median(d.APT_LAT),
    APT_LONG: (d)=> op.median(d.APT_LONG)

  });


//EmissionsPerAirportWithCoordinates = EmissionsPerAirport.join_left(airportsEmissionsFr, ["APT", "APT"])

  
 

  // EXERCISES
  createVisualizationsQ3(airportsEmissionsFr, EmissionsPerAirport);
}

function createVisualizationsQ3(airportsEmissionsFr, EmissionsPerAirport) {


  var selection3 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 900,
    height: 400,

    hconcat: [ {
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
          type: "mercator",
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
          values: EmissionsPerAirport.objects(),
        },

        transform:[ 
          {     
          from: {
            data: { values: EmissionsPerAirport.objects() },
            key: "APT",
            fields: ["APT_LONG", "APT_LAT"],
          },
          as: ["APT_LONG", "APT_LAT"],
          }

        ],


        projection: {
          type: "mercator",
        },
        mark: {
          type: "square",
          tooltip: true,
        },
        encoding: {
          longitude: {
            field: "APT_LONG",//"X_WGS84",
            type: "quantitative",
          },
          latitude: {
            field: "APT_LAT",//"Y_WGS84",
            type: "quantitative",
          },







          tooltip: [{ field: "APT", type: "nominal",},
                    {field: "total_CO2", type: "quantitative"},
                    {field: "total_NOX", type: "quantitative"}


                      
                      //, {field: "DEPARTEMEN", type: "nominal"}
                      //{field: "", type: "quantitative"}
                    ],
          size: {
            condition: { param: "selected", value: 900, empty: false }, // here the condition set that if the object is selected, the size will be 200, if not 50. The empty parameters sets that if the selection is empty then the condition selected is false
            "field": "total_CO2" , "type":"quantitative",
            "scale": {"type": "threshold", "domain": [1000, 2000, 5000], "range": [80,300, 600, 1500],} //"opacity":[0.2,0.7,0.8,0.9],"color": "ordinal" }

            
            //value: 800,
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
    ]
    },

    {
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
            type: "mercator",
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
            values: EmissionsPerAirport.objects(),
          },
  
          transform:[ 
            {     
            from: {
              data: { values: EmissionsPerAirport.objects() },
              key: "APT",
              fields: ["APT_LONG", "APT_LAT"],
            },
            as: ["APT_LONG", "APT_LAT"],
            }
  
          ],
  
  
          projection: {
            type: "mercator",
          },
          mark: {
            type: "square",
            tooltip: true,
          },
          encoding: {
            longitude: {
              field: "APT_LONG",//"X_WGS84",
              type: "quantitative",
            },
            latitude: {
              field: "APT_LAT",//"Y_WGS84",
              type: "quantitative",
            },
  
            tooltip: [{ field: "APT", type: "nominal",},
                      {field: "total_CO2", type: "quantitative"}
  
                        
                        //, {field: "DEPARTEMEN", type: "nominal"}
                        //{field: "", type: "quantitative"}
                      ],
            size: {
              condition: { param: "selected", value: 900, empty: false }, // here the condition set that if the object is selected, the size will be 200, if not 50. The empty parameters sets that if the selection is empty then the condition selected is false
              "field": "total_CO2" , "type":"quantitative",
              "scale": {"type": "threshold", "domain": [1000, 2000, 5000], "range": [80,300, 600, 1500],} //"opacity":[0.2,0.7,0.8,0.9],"color": "ordinal" }
  
              
              //value: 800,
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
    ]
  }
    ],
  


  };
  vegaEmbed("#selection_3", selection3);

}

createVisualizations();





/*

  var multiple1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 400,
    height: 300,
    hconcat: [
      // les vues dans se tableau vont être disposées horizontalement
      {
        layer: [
          {
            data: {
              url: "https://mjlobo.github.io/teaching/eivp/departements.json",
              format: {
                type: "topojson",
                feature: "departements",
              },
            },
            projection: {
              type: "mercator",
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
                name: "selected", //la variable qui va stocker l'objet(s) selectionné
                select: { type: "point", on: "mouseover" }, //type de selection, ici on va sélectionner un point lorsque la souris survole le point
              }

            ],
            data: {
              values: gares.objects(),
            },
            projection: {
              type: "mercator",
            },
            mark: {
              type: "circle",
            },
            encoding: {
              longitude: {
                field: "X_WGS84",
                type: "quantitative",
              },
              latitude: {
                field: "Y_WGS84",
                type: "quantitative",
              },
              tooltip: [{ field: "LIBELLE", type: "nominal" }],
              size: {
                condition: { param: "selected", value: 200, empty: false }, // ici la condition veut dire que si l'objet correspond à l'objet selected, la tailler sera 100, sinon 50. Le paramètre permet de dire que si la sélection est vide on la considère pas comme dans l'objet "selected".
                value: 50,
              },
              color: { value: "steelblue" },
            },
          },
        ],
      },
      {
        layer: [
          {
            data: {
              url: "https://mjlobo.github.io/teaching/eivp/departements.json",
              format: {
                type: "topojson",
                feature: "departements",
              },
            },
            projection: {
              type: "mercator",
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
                name: "selected", //la variable qui va stocker l'objet(s) selectionné
                select: { type: "point", on: "mouseover" }, //type de selection, ici on va sélectionner un point lorsque la souris survole le point
              },
            ],
            data: {
              values: gares.objects(),
            },
            projection: {
              type: "mercator",
            },
            mark: {
              type: "circle",
            },
            encoding: {
              longitude: {
                field: "X_WGS84",
                type: "quantitative",
              },
              latitude: {
                field: "Y_WGS84",
                type: "quantitative",
              },
              tooltip: [{ field: "LIBELLE", type: "nominal" }],
              size: {
                condition: { param: "selected", value: 200, empty: false }, // ici la condition veut dire que si l'objet correspond à l'objet selected, la tailler sera 100, sinon 50. Le paramètre permet de dire que si la sélection est vide on la considère pas comme dans l'objet "selected".
                value: 50,
              },
              color: { value: "steelblue" },
            },
          },
        ],
      },
    ],
  };
  vegaEmbed("#multiple_1", multiple1);


*/