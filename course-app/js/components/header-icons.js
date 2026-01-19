/**
 * Header Icons - SVG Icon Library
 * Lightweight SVG icons for the header component
 */

export const HeaderIcons = {
  /**
   * Search icon (magnifying glass)
   */
  search: `
    <svg class="header__search-icon icon icon--search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  `,

  /**
   * Bell icon (notifications)
   */
  bell: `
    <svg class="header__notifications-icon icon icon--bell" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  `,

  /**
   * Fire icon (streak)
   */
  fire: `
    <svg class="header__streak-icon icon icon--fire" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2c.7 3.5-2.5 5.5-2.5 8.5 0 2.5 2 4.5 4.5 4.5 1.7 0 3.2-.9 4-2.3.8 1.8.5 4.3-1.5 6.3-2.5 2.5-6.5 2.5-9 0s-2.5-6.5 0-9c1.3-1.3 2.9-2 4.5-2V2z" fill="currentColor"/>
    </svg>
  `,

  /**
   * Chevron down icon (dropdown)
   */
  chevronDown: `
    <svg class="header__user-dropdown-icon icon icon--chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  `,

  /**
   * User icon (alternative to avatar)
   */
  user: `
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `,

  /**
   * Settings icon
   */
  settings: `
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v6m0 6v6m8.66-13L16 10m-4 4-4.66 4.66M1 12h6m6 0h6m-12.66-8L10 8m4 4 4.66 4.66"/>
    </svg>
  `,

  /**
   * Log out icon
   */
  logOut: `
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  `,

  /**
   * Help/Question icon
   */
  help: `
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  `,

  /**
   * Menu/Hamburger icon (mobile)
   */
  menu: `
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  `,

  /**
   * Close/X icon
   */
  close: `
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `,
};

/**
 * Helper function to get icon HTML string
 * @param {string} iconName - Name of the icon (e.g., 'search', 'bell')
 * @returns {string} SVG HTML string
 */
export function getIcon(iconName) {
  return HeaderIcons[iconName] || '';
}

/**
 * Helper function to create icon element
 * @param {string} iconName - Name of the icon
 * @returns {HTMLElement} SVG element
 */
export function createIcon(iconName) {
  const template = document.createElement('template');
  template.innerHTML = getIcon(iconName).trim();
  return template.content.firstChild;
}

// CommonJS export for Node environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HeaderIcons, getIcon, createIcon };
}
