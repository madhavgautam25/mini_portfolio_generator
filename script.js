// Portfolio Generator JavaScript
class PortfolioGenerator {
    constructor() {
        // Initialize form data with default values
        this.formData = {
    //         name: 'John Doe',
    //         title: 'Full Stack Developer',
    //         about: 'Passionate computer science student with experience in web development and problem-solving. Always eager to learn new technologies and contribute to meaningful projects.',
    //         email: 'john.doe@email.com',
    //         phone: '+1 (555) 123-4567',
    //         github: 'johndoe',
    //         linkedin: 'johndoe',
    //         skills: 'JavaScript, React, Node.js, Python, HTML/CSS, Git',
            projects: [
                {
                    name: 'Weather App',
                    description: 'A responsive weather application built with React and OpenWeather API',
                    tech: 'React, JavaScript, CSS',
                    link: 'https://github.com/johndoe/weather-app'
                },
                {
                    name: 'Task Manager',
                    description: 'Full-stack task management system with user authentication',
                    tech: 'Node.js, Express, MongoDB',
                    link: 'https://github.com/johndoe/task-manager'
                }
            ]
        };

        this.projectCounter = 0;
        this.init();
    }

    // Initialize the application
    init() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Load default data into form
        this.loadFormData();
        
        // Render initial projects
        this.renderProjects();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Generate initial preview
        this.updatePreview();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Form inputs - real-time updates
        document.querySelectorAll('input, textarea').forEach(input => {
            if (!input.classList.contains('project-name') && 
                !input.classList.contains('project-description') && 
                !input.classList.contains('project-tech') && 
                !input.classList.contains('project-link')) {
                input.addEventListener('input', (e) => {
                    this.updateFormData(e.target.name, e.target.value);
                    this.updatePreview();
                });
            }
        });

        // Project management
        document.getElementById('addProject').addEventListener('click', () => {
            this.addProject();
        });

        // Action buttons
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.switchTab('preview');
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadPortfolio();
        });

        document.getElementById('downloadPreviewBtn').addEventListener('click', () => {
            this.downloadPortfolio();
        });
    }

    // Load form data into inputs
    loadFormData() {
        Object.keys(this.formData).forEach(key => {
            if (key !== 'projects') {
                const input = document.getElementById(key);
                if (input) {
                    input.value = this.formData[key];
                }
            }
        });
    }

    // Update form data object
    updateFormData(key, value) {
        if (this.formData.hasOwnProperty(key)) {
            this.formData[key] = value;
        }
    }

    // Switch between tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Section`).classList.add('active');

        // Update preview if switching to preview tab
        if (tabName === 'preview') {
            this.updatePreview();
        }
    }

    // Render projects in the form
    renderProjects() {
        const container = document.getElementById('projectsContainer');
        container.innerHTML = '';
        
        this.formData.projects.forEach((project, index) => {
            this.addProjectToDOM(project, index);
        });

        // Re-initialize icons after DOM update
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Add a new project
    addProject() {
        const newProject = {
            name: '',
            description: '',
            tech: '',
            link: ''
        };
        
        this.formData.projects.push(newProject);
        this.addProjectToDOM(newProject, this.formData.projects.length - 1);
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Add project to DOM
    addProjectToDOM(project, index) {
        const template = document.getElementById('projectTemplate');
        const clone = template.content.cloneNode(true);
        
        // Update project number
        clone.querySelector('.project-number').textContent = `Project ${index + 1}`;
        
        // Set input values
        clone.querySelector('.project-name').value = project.name;
        clone.querySelector('.project-description').value = project.description;
        clone.querySelector('.project-tech').value = project.tech;
        clone.querySelector('.project-link').value = project.link;
        
        // Add event listeners for project inputs
        clone.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateProjectData(index, e.target.className.split('-')[1], e.target.value);
                this.updatePreview();
            });
        });
        
        // Add remove button listener
        const removeBtn = clone.querySelector('.remove-project');
        if (this.formData.projects.length > 1) {
            removeBtn.addEventListener('click', () => {
                this.removeProject(index);
            });
        } else {
            removeBtn.style.display = 'none';
        }
        
        document.getElementById('projectsContainer').appendChild(clone);
    }

    // Update project data
    updateProjectData(index, field, value) {
        if (this.formData.projects[index]) {
            this.formData.projects[index][field] = value;
        }
    }

    // Remove project
    removeProject(index) {
        this.formData.projects.splice(index, 1);
        this.renderProjects();
        this.updatePreview();
    }

    // Generate portfolio HTML template
    generatePortfolioHTML() {
        const skillsArray = this.formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        const validProjects = this.formData.projects.filter(project => project.name.trim());
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.formData.name} - Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }

        .portfolio {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 60px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .header .title {
            font-size: 1.3rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px;
        }

        .section {
            margin-bottom: 50px;
        }

        .section h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            display: inline-block;
        }

        .about {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #555;
            background: #f8f9fa;
            padding: 30px;
            border-radius: 10px;
            border-left: 5px solid #3498db;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .skill-item {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 15px 20px;
            border-radius: 25px;
            text-align: center;
            font-weight: 500;
            transition: transform 0.3s ease;
        }

        .skill-item:hover {
            transform: translateY(-5px);
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 20px;
        }

        .project-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid #eee;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .project-card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .project-card p {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.6;
        }

        .project-tech {
            background: #ecf0f1;
            color: #2c3e50;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.9rem;
            margin-bottom: 15px;
            display: inline-block;
        }

        .project-link {
            color: #3498db;
            text-decoration: none;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: color 0.3s ease;
        }

        .project-link:hover {
            color: #2980b9;
        }

        .contact {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 40px;
            margin: 0 -40px -40px -40px;
            text-align: center;
        }

        .contact h2 {
            color: white;
            border-bottom-color: #3498db;
        }

        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }

        .contact-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .contact-item a {
            color: white;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .contact-item a:hover {
            color: #3498db;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .header {
                padding: 40px 20px;
            }

            .header h1 {
                font-size: 2rem;
            }

            .content {
                padding: 20px;
            }

            .projects-grid {
                grid-template-columns: 1fr;
            }

            .skills-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }

            .contact-info {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .contact {
                margin: 0 -20px -20px -20px;
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="portfolio">
            <!-- Header Section -->
            <header class="header">
                <h1>${this.formData.name}</h1>
                <p class="title">${this.formData.title}</p>
            </header>

            <div class="content">
                <!-- About Section -->
                <section class="section">
                    <h2>About Me</h2>
                    <div class="about">
                        ${this.formData.about}
                    </div>
                </section>

                <!-- Skills Section -->
                <section class="section">
                    <h2>Skills</h2>
                    <div class="skills-grid">
                        ${skillsArray.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                    </div>
                </section>

                <!-- Projects Section -->
                ${validProjects.length > 0 ? `
                <section class="section">
                    <h2>Projects</h2>
                    <div class="projects-grid">
                        ${validProjects.map(project => `
                            <div class="project-card">
                                <h3>${project.name}</h3>
                                <p>${project.description}</p>
                                ${project.tech ? `<div class="project-tech">${project.tech}</div>` : ''}
                                ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">View Project →</a>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}
            </div>

            <!-- Contact Section -->
            <section class="contact">
                <h2>Get In Touch</h2>
                <div class="contact-info">
                    <div class="contact-item">
                        <strong>Email</strong>
                        <a href="mailto:${this.formData.email}">${this.formData.email}</a>
                    </div>
                    ${this.formData.phone ? `
                    <div class="contact-item">
                        <strong>Phone</strong>
                        <span>${this.formData.phone}</span>
                    </div>` : ''}
                    ${this.formData.github ? `
                    <div class="contact-item">
                        <strong>GitHub</strong>
                        <a href="https://github.com/${this.formData.github}" target="_blank">@${this.formData.github}</a>
                    </div>` : ''}
                    ${this.formData.linkedin ? `
                    <div class="contact-item">
                        <strong>LinkedIn</strong>
                        <a href="https://linkedin.com/in/${this.formData.linkedin}" target="_blank">@${this.formData.linkedin}</a>
                    </div>` : ''}
                </div>
            </section>
        </div>
    </div>
</body>
</html>`;
    }

    // Update preview iframe
    updatePreview() {
        const iframe = document.getElementById('portfolioPreview');
        if (iframe) {
            const portfolioHTML = this.generatePortfolioHTML();
            iframe.srcdoc = portfolioHTML;
        }
    }

    // Download portfolio as HTML file
    downloadPortfolio() {
        try {
            const htmlContent = this.generatePortfolioHTML();
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `${this.formData.name.replace(/\s+/g, '_').toLowerCase()}_portfolio.html`;
            
            // Trigger download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Clean up
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
            
            // Show success message
            this.showNotification('Portfolio downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Download failed:', error);
            this.showNotification('Download failed. Please try again.', 'error');
        }
    }

    // Show notification to user
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : ''}
            ${type === 'error' ? 'background: #ef4444;' : ''}
            ${type === 'info' ? 'background: #3b82f6;' : ''}
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Validate form data
    validateForm() {
        const requiredFields = ['name', 'title', 'about', 'email', 'skills'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!this.formData[field] || this.formData[field].trim() === '') {
                missingFields.push(field);
            }
        });
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.formData.email && !emailRegex.test(this.formData.email)) {
            missingFields.push('email (invalid format)');
        }
        
        return {
            isValid: missingFields.length === 0,
            missingFields: missingFields
        };
    }

    // Export configuration (for future enhancement)
    exportConfig() {
        return JSON.stringify(this.formData, null, 2);
    }

    // Import configuration (for future enhancement)
    importConfig(configJSON) {
        try {
            const config = JSON.parse(configJSON);
            this.formData = { ...this.formData, ...config };
            this.loadFormData();
            this.renderProjects();
            this.updatePreview();
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.portfolioGenerator = new PortfolioGenerator();
    
    // Add some helpful console methods for debugging
    console.log('Portfolio Generator loaded successfully!');
    console.log('Access the generator instance via: window.portfolioGenerator');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to download
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            window.portfolioGenerator.downloadPortfolio();
        }
        
        // Ctrl/Cmd + P to preview
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.portfolioGenerator.switchTab('preview');
        }
        
        // Escape to go back to form
        if (e.key === 'Escape') {
            window.portfolioGenerator.switchTab('form');
        }
    });
});

// Utility functions
const utils = {
    // Sanitize HTML to prevent XSS
    sanitizeHTML: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    // Format name for filename
    formatFilename: (name) => {
        return name.toLowerCase()
                  .replace(/[^a-z0-9]/g, '_')
                  .replace(/_+/g, '_')
                  .replace(/^_|_$/g, '');
    },
    
    // Validate URL
    isValidURL: (str) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }
};

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioGenerator;
}