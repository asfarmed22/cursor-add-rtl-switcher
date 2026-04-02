(function() {
    const BUTTON_ID = 'rtl-toggle-btn-composer';
    const STYLE_ID = 'rtl-scoped-style';

    function initRtl() {
        // Ensure that the document body is available before proceeding
        if (!document.body) {
            setTimeout(initRtl, 100); // Retry after 100ms
            return;
        }

        // 1. Inject CSS styles (Targeting elements within .conversations only)
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
                /* Apply RTL when the mode is active on the body */
                .rtl-active-mode .conversations p, 
                .rtl-active-mode .conversations ul, 
                .rtl-active-mode .conversations h1, 
                .rtl-active-mode .conversations h2, 
                .rtl-active-mode .conversations h3, 
                .rtl-active-mode .conversations span,
                .rtl-active-mode .conversations div,
                .rtl-active-mode .conversations [role="presentation"] {
                    direction: rtl !important;
                    text-align: right !important;
                }

                /* Exception for code blocks: Keep them Left-to-Right */
                .rtl-active-mode .conversations code, 
                .rtl-active-mode .conversations pre,
                .rtl-active-mode .conversations .monaco-editor-contents {
                    direction: ltr !important;
                    text-align: left !important;
                }

                /* Visual style for the button when toggled ON */
                .rtl-btn-active { 
                    background-color: var(--vscode-button-secondaryBackground, rgba(255, 255, 255, 0.1)) !important;
                    color: var(--vscode-button-secondaryForeground, #ffffff) !important;
                    outline: 1px solid var(--vscode-button-border, #505050) !important;
                }
            `;
            document.head.appendChild(style);
        }

        const injectButton = () => {
            // Find the toolbar container in the Composer section
            const toolbar = document.querySelector('#composer-toolbar-section div[style*="justify-content: flex-end"]');
            
            if (toolbar && !document.getElementById(BUTTON_ID)) {
                const btn = document.createElement('div');
                btn.id = BUTTON_ID;
                
                // Inherit Cursor's native button classes for consistent UI
                btn.className = 'flex flex-nowrap items-center justify-center gap-[4px] px-[6px] rounded cursor-pointer whitespace-nowrap shrink-0 anysphere-secondary-button py-0';
                
                // Fine-tune styling to match neighbor buttons
                btn.style.height = '18.5px';
                btn.style.fontSize = '12px';
                btn.style.border = 'none'; 
                btn.style.padding = '0 6px'; 
                btn.style.backgroundColor = 'transparent'; 

                const spanText = document.createElement('span');
                spanText.textContent = 'RTL';
                btn.appendChild(spanText);

                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle the global RTL class on the body
                    const isActive = document.body.classList.toggle('rtl-active-mode');
                    
                    // Update button appearance based on state
                    if (isActive) {
                        btn.style.fontWeight = 'bold';
                        btn.style.opacity = '1';
                        btn.classList.add('rtl-btn-active');
                    } else {
                        btn.style.fontWeight = 'normal';
                        btn.style.opacity = '0.8';
                        btn.classList.remove('rtl-btn-active');
                    }
                };

                // Insert the button at the beginning of the toolbar
                toolbar.insertBefore(btn, toolbar.firstChild);
            }
        };

        // 2. Setup MutationObserver to ensure the button persists after React re-renders
        const observer = new MutationObserver(injectButton);
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });

        // Initial execution
        injectButton();
    }

    // Start the initialization when the DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initRtl();
    } else {
        document.addEventListener('DOMContentLoaded', initRtl);
    }
})();
