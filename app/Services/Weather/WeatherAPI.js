import { DrawAreas } from '../Areas/DrawAreas.js';
import polygonCenter from 'geojson-polygon-center';

export class WeatherAPI {
    static async saveWeatherDataToArea() {
        var center = [];
        var drawAreas = await DrawAreas.getDrawAreasFromDb();
        drawAreas = drawAreas[0].features;
    
        if (drawAreas && drawAreas.length) {
            drawAreas.forEach(function (value) {
                //calculate centroid point 
                center.push(polygonCenter(value.geometry));
            });
        }
        return { "msg": "success", "data": center, "code": 201 }; 
    }
};

