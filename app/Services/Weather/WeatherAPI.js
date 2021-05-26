import { DrawAreas } from '../Areas/DrawAreas.js';
import polygonCenter from 'geojson-polygon-center';

export class WeatherAPI {
    static async saveWeatherDataToArea() {
        var centers = [];
        var center = {};
        var drawAreas = await DrawAreas.getDrawAreasFromDb();
        drawAreas = drawAreas[0].features;
    
        if (drawAreas && drawAreas.length) {
            drawAreas.forEach(function (value) {
                //calculate centroid point 
                center = polygonCenter(value.geometry);
                center.BGRI11 = value.properties.BGRI11;
                centers.push(center);
            });
        }
        return { "msg": "success", "data": centers, "code": 201 }; 
    }
};

