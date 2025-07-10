# CreateProjectDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**color** | **str** |  | 

## Example

```python
from openapi_client.models.create_project_dto import CreateProjectDto

# TODO update the JSON string below
json = "{}"
# create an instance of CreateProjectDto from a JSON string
create_project_dto_instance = CreateProjectDto.from_json(json)
# print the JSON string representation of the object
print(CreateProjectDto.to_json())

# convert the object into a dict
create_project_dto_dict = create_project_dto_instance.to_dict()
# create an instance of CreateProjectDto from a dict
create_project_dto_from_dict = CreateProjectDto.from_dict(create_project_dto_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


