
const EFFECT_RADIUS = 10;
const EFFECT_DURATION = 60;
const BOOST_CHECK_INTERVAL = 60;   // 1 секунда
const DAMAGE_INTERVAL = 600;       // 10 секунд
const DAMAGE_AMOUNT = 50;

const uranium = Vars.content.items().find(i => i.name === "uranium235");
const overclock = StatusEffects.overclock;

// Таймер для урона
let lastDamageTime = 0;

Events.run(Trigger.update, () => {
    const now = Time.time;

    const radiusPx = EFFECT_RADIUS * Vars.tilesize;

    // --- 1. Ускорение от блоков и юнитов с ураном
    if (now % BOOST_CHECK_INTERVAL === 0) {

        // Блоки с ураном выдают ускорение
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

        // Юниты с ураном ускоряют других рядом
        Groups.unit.each(source => {
            if (!source.items || !source.items.has(uranium)) return;

            Groups.unit.each(target => {
                // можно убрать это условие, если нужно усиление самого себя
                if (target === source) return;

                if (Mathf.dst(source.x, source.y, target.x, target.y) <= radiusPx) {
                    target.apply(overclock, EFFECT_DURATION);
                }
            });
        });
    }

    // --- 2. Урон юнитам с ураном
    if (now - lastDamageTime >= DAMAGE_INTERVAL) {
        lastDamageTime = now;

        Groups.unit.each(unit => {
            if (unit.items && unit.items.has(uranium)) {
                unit.damage(DAMAGE_AMOUNT);
            }
        });
    }
});
