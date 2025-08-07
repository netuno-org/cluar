export const FONT_FAMILY_OPTIONS = [
    ['inherit', 'Default'],
    ['Arial', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Verdana', 'Verdana'],
];

export const FONT_SIZE_OPTIONS = [
    ['10px', '10'],
    ['12px', '12'],
    ['14px', '14'],
    ['16px', '16'],
    ['18px', '18'],
    ['24px', '24'],
    ['32px', '32'],
    ['48px', '48'],
];

export function dropDownActiveClass(condition) {
    return condition ? 'active' : '';
}