import requests
import urllib


class Twitter(object):
    def __init__(self):
        self.bearer_token = None

    def acquire_token(self, key, secret):
        pre_token = '{key}:{secret}'.format(
            key=urllib.quote(key),
            secret=urllib.quote(secret)
        ).encode('base64').replace('\n', '')
        response = requests.post(
            'https://api.twitter.com/oauth2/token',
            headers={
                'Authorization': 'Basic {base}'.format(base=pre_token),
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data='grant_type=client_credentials'
        ).json()
        if response['token_type'] == 'bearer':
            self.bearer_token = response['access_token']

    def get_profile(self, screen_name):
        profile = self._get_request(
            'users/show.json',
            {
                'screen_name': screen_name
            }
        )
        profile['high_profile_image_url'] = ''.join(
            profile['profile_image_url'].rsplit('_normal', 1)
        )
        return profile

    def get_timeline(self, screen_name, count=100):
        return self._get_request(
            'statuses/user_timeline.json',
            {
                'screen_name': screen_name,
                'count': count
            }
        )

    def _get_request(self, endpoint, params=None):
        twitter_response = requests.get(
            'https://api.twitter.com/1.1/{}'.format(endpoint),
            headers={
                'Authorization': 'Bearer {bearer}'.format(
                    bearer=self.bearer_token
                )
            },
            params=params
        ).json()
        if type(twitter_response) is dict and 'error' in twitter_response:
            raise Exception(str(twitter_response))
        if type(twitter_response) is dict and 'errors' in twitter_response:
            raise Exception(str(twitter_response))
        return twitter_response


if __name__ == '__main__':
    t = Twitter()
    t.acquire_token(
        '7X5Jm7TyQnVebJBwRnKtJYjwz',
        'cwqB3zScXxjqiCRlQRGoZvx2mPYCvsYteongSmRb3DVkhDLQ6M'
    )
    print t.get_timeline('mjohnsullivan')
