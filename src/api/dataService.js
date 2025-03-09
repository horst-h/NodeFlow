export function fetchData() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(
                Array.from({ length: 5 }, (_, i) => ({ id: `Node ${i}`, icon: randomIcon() }))
            );
        }, 500);
    });
}

function randomIcon() {
    const faIcons = ["\uf007", "\uf0c0", "\uf19c", "\uf233", "\uf2bb", "\uf3c5", "\uf6d9"];
    return faIcons[Math.floor(Math.random() * faIcons.length)];
}
