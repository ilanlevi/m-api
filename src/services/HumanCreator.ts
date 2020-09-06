import { Human } from 'src/interfaces/types';

const FIRST_NAME = ['bla', 'Ilan', 'Roy', 'Nadav', 'Omer'];
const LOCATIONS = ['TA', 'HAIFA', 'BLAAAAA'];
const MAX_ID = 2222;

export default class HumanCreator {
  static genDb(queryMapName: string, mapType: string, numberOfHumans: number): Map<string, Human> {
    const newMap = new Map<string, Human>();

    for (let i = 0; i < numberOfHumans; i++) {
      const rnd1 = FIRST_NAME[Math.floor(Math.random() * FIRST_NAME.length)];
      const rnd2 = FIRST_NAME[Math.floor(Math.random() * FIRST_NAME.length)];
      const rndLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const rndID = Math.floor(Math.random() * MAX_ID);

      newMap.set(`${rndID}`, {
        lastUpdated: new Date().getMilliseconds(),
        actionType: 'CREATE',
        entity: {
          mapType: mapType,
          name: `${rnd1}, ${rnd2}`,
          id: rndID,
          location: rndLocation
        },
      });
    }

    return newMap;
  }
}
