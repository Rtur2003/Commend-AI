#!/usr/bin/env python3
"""Test Pydantic model locally"""

from app.routes.comment_routes import PostCommentRequest

print('Testing Pydantic model...')

# Test 1: Without comment_id
try:
    model1 = PostCommentRequest(
        video_url='https://www.youtube.com/watch?v=test123',
        comment_text='Test comment'
    )
    print('SUCCESS: Test 1 PASSED - Without comment_id')
    print(f'  comment_id value: {model1.comment_id}')
    print(f'  comment_id type: {type(model1.comment_id)}')
except Exception as e:
    print(f'FAILED: Test 1 - {e}')

# Test 2: With comment_id
try:
    model2 = PostCommentRequest(
        video_url='https://www.youtube.com/watch?v=test123',
        comment_text='Test comment',
        comment_id='test-id-123'
    )
    print('SUCCESS: Test 2 PASSED - With comment_id')
    print(f'  comment_id value: {model2.comment_id}')
    print(f'  comment_id type: {type(model2.comment_id)}')
except Exception as e:
    print(f'FAILED: Test 2 - {e}')

# Test 3: With None comment_id explicitly
try:
    model3 = PostCommentRequest(
        video_url='https://www.youtube.com/watch?v=test123',
        comment_text='Test comment',
        comment_id=None
    )
    print('SUCCESS: Test 3 PASSED - With None comment_id')
    print(f'  comment_id value: {model3.comment_id}')
    print(f'  comment_id type: {type(model3.comment_id)}')
except Exception as e:
    print(f'FAILED: Test 3 - {e}')