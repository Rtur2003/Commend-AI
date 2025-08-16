"""
Centralized logging configuration for Commend AI
"""
import logging
import os
import sys
from logging.handlers import RotatingFileHandler
from datetime import datetime


def setup_logger(name: str = __name__, level: str = None) -> logging.Logger:
    """
    Setup centralized logger with file and console handlers
    
    Args:
        name: Logger name (usually __name__)
        level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    
    Returns:
        Configured logger instance
    """
    # Get log level from environment or default to INFO
    if level is None:
        level = os.getenv('LOG_LEVEL', 'INFO').upper()
    
    # Create logger
    logger = logging.getLogger(name)
    
    # Prevent duplicate handlers
    if logger.handlers:
        return logger
        
    logger.setLevel(getattr(logging, level, logging.INFO))
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
    )
    
    simple_formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(simple_formatter)
    logger.addHandler(console_handler)
    
    # File handler (only in development or if LOG_FILE is set)
    log_file = os.getenv('LOG_FILE')
    if log_file or os.getenv('FLASK_ENV') != 'production':
        if not log_file:
            # Default log file location
            log_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')
            os.makedirs(log_dir, exist_ok=True)
            log_file = os.path.join(log_dir, f'commend_ai_{datetime.now().strftime("%Y%m%d")}.log')
        
        file_handler = RotatingFileHandler(
            log_file, 
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(detailed_formatter)
        logger.addHandler(file_handler)
    
    return logger


# Create default logger for the application
app_logger = setup_logger('commend_ai')


def get_logger(name: str = None) -> logging.Logger:
    """
    Get a logger instance for the given module
    
    Args:
        name: Module name (usually __name__)
    
    Returns:
        Logger instance
    """
    if name is None:
        return app_logger
    return setup_logger(name)