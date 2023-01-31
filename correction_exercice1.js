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
document.getElementById('selection_2').innerHTML = EmissionsPerAirport.toHTML();

  
//https://cartographyvectors.com/map/854-austria-detailed-boundary

  // EXERCISES
  createVisualizationsQ1(airportsEmissionsFr, EmissionsPerAirport);
}

function createVisualizationsQ1(airportsEmissionsFr, EmissionsPerAirport) {


  var selection1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 900,
    height: 400,
    params: [
      {
        name: "Minimum_CO2",
        value: 20,
        bind: { input: "range", min: 10, max: 20000, step: 1000 }, // we define the input type and the minimum and maixmum values
      },
    ],
    

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
          },
          {
          filter:
            "datum.APT_LONG != null && datum.APT_LAT != null && datum.total_CO2>Minimum_CO2",
          },
        ],


        projection: {
          type: "mercator",
        },
        mark: {
          type: "circle",
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
    ],
  };
  vegaEmbed("#selection_1", selection1);

}

createVisualizations();
















