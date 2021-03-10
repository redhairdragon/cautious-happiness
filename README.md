# Guide to use cautious-happiness
This is for visualizing pipline stages for DeepSpeed.

## Set up Angular 
Having nodejs installed and run this to install angular:

`npm install -g @angular/cli`

Inside timeline folder, run this to start development server:

`ng serve --host 0.0.0.0 --port 3000`



## Generate log file
On each worker, make sure there is no "pipeline_profile_log" file. (The current code will simply append logs)
After training run finished, you should merge the log file on each worker.



Sample code for generating hostfile:

```python
#!/usr/bin/python3
import boto3
client = boto3.client('ec2')
response = client.describe_instances(
    Filters=[{
        "Name": "tag:usr",
        "Values": ['shen']
    }]
)
private_ips = []
for insts in response['Reservations']:
    for inst in insts["Instances"]:
        if "PrivateIpAddress" in inst and inst['State']['Name'] == 'running':
            private_ips.append(inst["PrivateIpAddress"])
with open("hostfile", "w") as f:
    for ip in private_ips:
        f.write("ubuntu@"+ip+" slot=1\n")
```

Sample merge code:

```shell
#!/bin/bash
host_filename='hostfile'
result_filename='merged_logs'
log_filename='pipeline_profile_log'
rm -f $result_filename
touch $result_filename
while read line; do 
    host=`echo $line | awk -F\  '{print $1}'`
    ssh -n $host "cat `pwd`/$log_filename" >>$result_filename
    echo $host
done < $host_filename
```



## 



## Useful links: 

1. [What is Angular?](https://angular.io/guide/what-is-angular)
2. [the official Angular tutorial from Google](https://angular.io/tutorial)
3. [Google Charts Angular wrapper](https://github.com/FERNman/angular-google-charts)
4.  [Google Charts](https://developers.google.com/chart/interactive/docs/quick_start)

