import numpy as np
from sklearn.preprocessing import StandardScaler
import pandas as pd
from datetime import datetime

class LearningPaceAnalyzer:
    def __init__(self):
        self.learning_speeds = {
            'slow': (0, 0.33),
            'medium': (0.34, 0.66),
            'fast': (0.67, 1.0)
        }
        self.scaler = StandardScaler()

    def calculate_learning_pace(self, student_data):
        """
        Calculate student's learning pace based on multiple factors
        """
        # Normalize scores between 0 and 1
        completion_time = student_data['completion_time']
        accuracy = student_data['quiz_scores']
        engagement = student_data['engagement_metrics']
        
        # Calculate composite score
        time_score = self._normalize_time(completion_time)
        accuracy_score = np.mean(accuracy) / 100
        engagement_score = np.mean(engagement) / 100
        
        # Weighted average for final pace score
        weights = {'time': 0.3, 'accuracy': 0.5, 'engagement': 0.2}
        pace_score = (
            time_score * weights['time'] +
            accuracy_score * weights['accuracy'] +
            engagement_score * weights['engagement']
        )
        
        return self._determine_pace_category(pace_score)

    def _normalize_time(self, completion_time):
        """Normalize completion time to a 0-1 scale"""
        expected_time = completion_time['expected']
        actual_time = completion_time['actual']
        
        # Time efficiency score (1 = faster, 0 = slower)
        time_score = max(0, min(1, expected_time / actual_time))
        return time_score

    def _determine_pace_category(self, score):
        """Determine learning pace category based on score"""
        for pace, (min_score, max_score) in self.learning_speeds.items():
            if min_score <= score <= max_score:
                return pace
        return 'medium'  # Default to medium if not in ranges

    def get_course_recommendations(self, learning_pace, course_data):
        """Get course recommendations based on learning pace"""
        recommendations = {
            'slow': {
                'content_type': 'detailed',
                'extra_resources': True,
                'practice_exercises': 'more',
                'session_duration': '30 min'
            },
            'medium': {
                'content_type': 'balanced',
                'extra_resources': 'optional',
                'practice_exercises': 'standard',
                'session_duration': '45 min'
            },
            'fast': {
                'content_type': 'advanced',
                'extra_resources': False,
                'practice_exercises': 'challenging',
                'session_duration': '60 min'
            }
        }
        
        return recommendations.get(learning_pace, recommendations['medium'])

def analyze_student_performance(student_id, course_id):
    # Example usage
    analyzer = LearningPaceAnalyzer()
    
    # Sample student data (in real application, this would come from a database)
    student_data = {
        'completion_time': {
            'expected': 60,  # minutes
            'actual': 55
        },
        'quiz_scores': [85, 90, 88, 92],  # percentage scores
        'engagement_metrics': [90, 85, 95]  # engagement percentages
    }
    
    # Calculate learning pace
    learning_pace = analyzer.calculate_learning_pace(student_data)
    
    # Get recommendations
    recommendations = analyzer.get_course_recommendations(learning_pace, None)
    
    # Calculate accuracy and statistics
    accuracy = np.mean(student_data['quiz_scores'])
    stats = {
        'student_id': student_id,
        'course_id': course_id,
        'learning_pace': learning_pace,
        'accuracy': accuracy,
        'recommendations': recommendations,
        'timestamp': datetime.now().isoformat()
    }
    
    return stats

# Example usage
if __name__ == "__main__":
    # Example student analysis
    student_performance = analyze_student_performance(
        student_id="STU001",
        course_id="COURSE101"
    )
    
    print("\nStudent Learning Analysis:")
    print("=======================")
    print(f"Learning Pace: {student_performance['learning_pace']}")
    print(f"Accuracy: {student_performance['accuracy']:.2f}%")
    print("\nRecommendations:")
    for key, value in student_performance['recommendations'].items():
        print(f"- {key}: {value}")
