import React from 'react';
import styles from './LoadingIndicator.module.css';

const LoadingIndicator: React.FC = () => <div className={styles.spinner} role="status"></div>;

export default LoadingIndicator;
