
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function createMonsterActors(scene) {
    const actors = [];

    const skin = new THREE.MeshStandardMaterial({ color: 0x806047 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x17130f });
    const fur = new THREE.MeshStandardMaterial({ color: 0x493d30 });
    const red = new THREE.MeshStandardMaterial({ color: 0x780d19 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x684326 });
    const metal = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.7,
        roughness: 0.3
    });
    const chalk = new THREE.MeshBasicMaterial({ color: 0xf0ead7 });

    function part(group, geometry, material, x, y, z) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        return mesh;
    }

    // =====================================
    // BUSH BABY: CROUCHING LIKE A CHILD
    // =====================================

    function makeBushBaby() {
        const group = new THREE.Group();

        const body = part(
            group,
            new THREE.SphereGeometry(0.48, 16, 12),
            fur, 0, 0.65, 0
        );
        body.scale.set(0.9, 0.8, 1.1);

        const head = part(
            group,
            new THREE.SphereGeometry(0.36, 20, 16),
            skin, 0, 1.12, -0.25
        );

        // Large, unsettling eyes
        for (const x of [-0.15, 0.15]) {
            const eye = part(
                group,
                new THREE.SphereGeometry(0.09, 12, 10),
                dark, x, 1.17, -0.56
            );

            part(
                group,
                new THREE.SphereGeometry(0.035, 10, 8),
                new THREE.MeshBasicMaterial({ color: 0xffdca0 }),
                x, 1.18, -0.635
            );
        }

        // Folded legs
        for (const x of [-0.28, 0.28]) {
            const leg = part(
                group,
                new THREE.CylinderGeometry(0.13, 0.16, 0.5, 10),
                fur, x, 0.3, 0.25
            );
            leg.rotation.x = -0.8;
        }

        // Long arms resting near knees
        for (const x of [-0.4, 0.4]) {
            const arm = part(
                group,
                new THREE.CylinderGeometry(0.07, 0.1, 0.55, 10),
                fur, x, 0.55, -0.15
            );
            arm.rotation.z = x > 0 ? -0.45 : 0.45;
        }

        // Tufts of hair
        for (let i = 0; i < 9; i++) {
            const angle = i * Math.PI * 2 / 9;
            const tuft = part(
                group,
                new THREE.ConeGeometry(0.09, 0.3, 5),
                dark,
                Math.cos(angle) * 0.25,
                1.43,
                -0.25 + Math.sin(angle) * 0.2
            );
            tuft.rotation.z = Math.cos(angle) * 0.5;
        }

        group.position.set(-10, 0, -4);
        scene.add(group);

        return {
            name: 'Bush Baby',
            group,
            update(time) {
                // Innocent-looking breathing and head tilting
                body.scale.y = 0.8 + Math.sin(time * 2) * 0.025;
                head.rotation.z = Math.sin(time * 0.7) * 0.12;
                head.rotation.x = Math.sin(time * 0.5) * 0.08;
            }
        };
    }

    // =====================================
    // OPIANKWU: THE WOODCUTTER
    // =====================================

    function makeOpiankwu() {
        const group = new THREE.Group();

        const body = part(
            group,
            new THREE.CylinderGeometry(0.34, 0.48, 1.2, 12),
            dark, 0, 1, 0
        );

        const head = part(
            group,
            new THREE.SphereGeometry(0.3, 16, 12),
            skin, 0, 1.85, 0
        );

        // Dark eyes
        for (const x of [-0.12, 0.12]) {
            part(
                group,
                new THREE.SphereGeometry(0.045, 8, 8),
                dark, x, 1.9, -0.26
            );
        }

        // Arms
        const leftArm = part(
            group,
            new THREE.CylinderGeometry(0.09, 0.12, 0.8, 10),
            dark, -0.48, 1.25, 0
        );

        const rightArm = part(
            group,
            new THREE.CylinderGeometry(0.09, 0.12, 0.8, 10),
            dark, 0.48, 1.25, 0
        );

        // Axe handle and blade
        const axe = new THREE.Group();

        const handle = part(
            axe,
            new THREE.CylinderGeometry(0.045, 0.045, 1.05, 10),
            wood, 0, 0, 0
        );

        const blade = part(
            axe,
            new THREE.BoxGeometry(0.42, 0.28, 0.08),
            metal, 0.2, 0.42, 0
        );

        axe.position.set(0.5, 1.5, -0.2);
        group.add(axe);

        // His second weapon: a wooden stick
        const stick = part(
            group,
            new THREE.CylinderGeometry(0.045, 0.055, 1.15, 8),
            wood, -0.65, 0.85, 0.1
        );
        stick.rotation.z = 0.15;

        // Tree trunk
        const tree = new THREE.Group();

        part(
            tree,
            new THREE.CylinderGeometry(0.38, 0.5, 3.5, 12),
            wood, 0, 1.75, 0
        );

        tree.position.set(1.8, 0, -1.2);
        group.add(tree);

        // Log at the bottom of the tree
        part(
            group,
            new THREE.CylinderGeometry(0.25, 0.25, 1.2, 12),
            wood, 1.1, 0.28, -0.8
        ).rotation.z = Math.PI / 2;

        group.position.set(10, 0, -4);
        scene.add(group);

        return {
            name: 'Opiankwu',
            group,
            update(time) {
                // Repeated wood chopping animation
                const swing = Math.max(0, Math.sin(time * 2.4));

                axe.rotation.z = -0.1 - swing * 1.35;
                rightArm.rotation.z = -0.5 - swing * 0.8;

                // Slow body movement while chopping
                body.rotation.z = Math.sin(time * 2.4) * 0.035;
            }
        };
    }

    // =====================================
    // MADAM KOI-KOI: THE CHALK TEACHER
    // =====================================

    function makeMadam() {
        const group = new THREE.Group();

        const dress = part(
            group,
            new THREE.ConeGeometry(0.65, 1.6, 16),
            red, 0, 0.9, 0
        );

        const head = part(
            group,
            new THREE.SphereGeometry(0.27, 16, 12),
            skin, 0, 1.9, 0
        );

        const hair = part(
            group,
            new THREE.SphereGeometry(0.34, 12, 10),
            dark, 0, 2.08, 0.04
        );
        hair.scale.set(1, 1.3, 1);

        // Chalkboard
        const boardMaterial = new THREE.MeshStandardMaterial({
            color: 0x101b16,
            roughness: 1
        });

        const board = part(
            group,
            new THREE.BoxGeometry(3.5, 2.2, 0.12),
            boardMaterial, 0, 2, -2
        );

        // Chalk writing marks
        const writing = [];

        for (let i = 0; i < 7; i++) {
            const mark = part(
                group,
                new THREE.BoxGeometry(1.2, 0.025, 0.025),
                chalk,
                -0.6 + Math.sin(i) * 0.15,
                2.6 - i * 0.22,
                -1.92
            );

            writing.push(mark);
        }

        // Chalk in her writing hand
        const chalkHand = part(
            group,
            new THREE.CylinderGeometry(0.025, 0.025, 0.3, 8),
            chalk, 0.65, 1.7, -0.8
        );

        const arm = part(
            group,
            new THREE.CylinderGeometry(0.07, 0.09, 0.75, 10),
            red, 0.42, 1.55, -0.3
        );

        group.position.set(-10, 0, -12);
        scene.add(group);

        return {
            name: 'Madam Koi-Koi',
            group,
            update(time) {
                // Slowly writing on the blackboard
                const movement = Math.sin(time * 1.4);

                arm.rotation.z = -0.8 + movement * 0.35;
                chalkHand.position.x = 0.65 + movement * 0.35;
                chalkHand.position.y = 1.7 + Math.sin(time * 1.4) * 0.12;

                // Subtle head movement
                head.rotation.z = Math.sin(time * 0.5) * 0.06;
            }
        };
    }

    actors.push(makeBushBaby());
    actors.push(makeOpiankwu());
    actors.push(makeMadam());

    return {
        actors,

        update(delta) {
            this.time = (this.time || 0) + delta;

            for (const actor of actors) {
                actor.update(this.time);
            }
        },

        remove() {
            for (const actor of actors) {
                scene.remove(actor.group);
            }
        }
    };
}
