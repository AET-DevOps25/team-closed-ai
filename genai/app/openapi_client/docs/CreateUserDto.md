# CreateUserDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**profile_picture** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.create_user_dto import CreateUserDto

# TODO update the JSON string below
json = "{}"
# create an instance of CreateUserDto from a JSON string
create_user_dto_instance = CreateUserDto.from_json(json)
# print the JSON string representation of the object
print(CreateUserDto.to_json())

# convert the object into a dict
create_user_dto_dict = create_user_dto_instance.to_dict()
# create an instance of CreateUserDto from a dict
create_user_dto_from_dict = CreateUserDto.from_dict(create_user_dto_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


