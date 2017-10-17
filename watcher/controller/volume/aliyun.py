import sys
import time
import hmac
import uuid
import base64
import urllib
import urllib.parse
import requests
from hashlib import sha1

host = 'http://ess.aliyuncs.com/?' 
access_key_id = "LTAIhkkCmeQu8SVd"
secret = "hLtbIuZDcWWs7ha1P8YsdzHGNMjEp3"
region_id = 'cn-hangzhou'
version = '2014-08-28'
scaling_group_id = "asg-bp1dwdfg32pr9aivomn7"
scaling_rule_ari = "ari:acs:ess:cn-hangzhou:1840903284313844:scalingrule/asr-bp1dwdfg32pr9cht8055"

class Aliyun:
    """
    """
    def __init__(self, action, instance_id=None):
        self.host = host
        self.version = version
        self.make_params(action, instance_id)
    
    @staticmethod
    def percent_encode(string):
        res = urllib.parse.quote(string, '')
        res = res.replace('+', '%20')
        res = res.replace('*', '%2A')
        res = res.replace('\'', '%27')
        res = res.replace('\"', '%22')
        res = res.replace('%7E', '~')
        return res

    @staticmethod
    def compute_signature(params, secret):
        sorted_params = sorted(params.items(), key=lambda x: x[0])

        canonical_string = ''
        for key, val in sorted_params:
            canonical_string += '&' + Aliyun.percent_encode(key) + '=' + Aliyun.percent_encode(val)

        stringToSign = 'GET&%2F&' + Aliyun.percent_encode(canonical_string[1:])
        h = hmac.new(str.encode(secret + '&'), str.encode(stringToSign), sha1)
        signature = base64.encodestring(h.digest()).strip()
        return signature

    @staticmethod
    def compose_url(host, version, user_params):
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        params = {
            'Format': 'JSON',
            'Version': version,
            'AccessKeyId': access_key_id,
            'RegionId': region_id,
            'SignatureVersion': '1.0',
            'SignatureMethod': 'HMAC-SHA1',
            'SignatureNonce': str(uuid.uuid1()),
            'Timestamp': timestamp,
        }
        for key, val in user_params.items():
            params[key] = val
        signature = Aliyun.compute_signature(params, secret)
        params['Signature'] = signature

        url = host + urllib.parse.urlencode(params)
        print(url)
        return url

    def make_params(self, action, instance_id):
        if action == 'DescribeScalingGroups':
            self.action_params = {
                'Action': action, 
                'ScalingGroupId': scaling_group_id
            }
        elif action == 'ExecuteScalingRule':
            self.action_params = {
                'Action': action,
                'ScalingGroupId': scaling_group_id,
                'ScalingRuleAri': scaling_rule_ari,
            }
        elif action == 'RemoveInstances':
            self.action_params = {
                'Action': action,
                'ScalingGroupId': scaling_group_id,
                'InstanceId.1': instance_id,
            }


    def request(self):
        url = Aliyun.compose_url(self.host, self.version, self.action_params)
        req = requests.get(url) 

        try:
            print(req.json())
        except:
            print('Request failed')

    

if __name__ == '__main__':
    describe_groups = Aliyun('DescribeScalingGroups')
    #describe_groups = Aliyun('ExecuteScalingRule')
    #describe_groups = Aliyun('RemoveInstances', 'i-bp13erybi4j4apt9knqb')
    describe_groups.request()

    # Available actions:
    ### 'DescribeInstances',
    ### 'ExecuteScalingRule',
    ### 'DescribeScalingGroups',
    ### 'DescribeScalingInstances',
    ### 'RemoveInstances',
    ### 'DescribeScalingActivities',



