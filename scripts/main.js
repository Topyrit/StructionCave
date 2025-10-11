
const EFFECT_RADIUS = 10;
const EFFECT_DURATION = 60;
const BOOST_CHECK_INTERVAL = 60;  
const DAMAGE_INTERVAL = 600;       
const DAMAGE_AMOUNT = 50;

const uranium = Vars.content.items().find(i => i.name === "uranium235");
const overclock = StatusEffects.overclock;

let lastDamageTime = 0;

Events.run(Trigger.update, () => {
    const now = Time.time;

    const radiusPx = EFFECT_RADIUS * Vars.tilesize;


    if (now % BOOST_CHECK_INTERVAL === 0) {

     
        Vars.world.tiles.eachTile(t => {
            const building = t.build;
            if (!building || !building.items) return;

            if (building.items.has(uranium)) {
                Groups.unit.each(u => {
                    if (Mathf.dst(u.x, u.y, building.x, building.y) <= radiusPx) {
                        u.apply(overclock, EFFECT_DURATION);
                    }
                });
            }
        });

        Groups.unit.each(source => {
            if (!source.items || !source.items.has(uranium)) return;

            Groups.unit.each(target => {
              
                if (target === source) return;

                if (Mathf.dst(source.x, source.y, target.x, target.y) <= radiusPx) {
                    target.apply(overclock, EFFECT_DURATION);
                }
            });
        });
    }

    if (now - lastDamageTime >= DAMAGE_INTERVAL) {
        lastDamageTime = now;

        Groups.unit.each(unit => {
            if (unit.items && unit.items.has(uranium)) {
                unit.damage(DAMAGE_AMOUNT);
            }
        });
    }
});
