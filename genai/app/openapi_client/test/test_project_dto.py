# coding: utf-8

"""
DevOps Closed AI Server API

API documentation for the DevOps Closed AI Server

The version of the OpenAPI document: 1.0.0
Generated by OpenAPI Generator (https://openapi-generator.tech)

Do not edit the class manually.
"""  # noqa: E501


import unittest

from openapi_client.models.project_dto import ProjectDto


class TestProjectDto(unittest.TestCase):
    """ProjectDto unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def make_instance(self, include_optional) -> ProjectDto:
        """Test ProjectDto
        include_optional is a boolean, when False only required
        params are included, when True both required and
        optional params are included"""
        # uncomment below to create an instance of `ProjectDto`
        """
        model = ProjectDto()
        if include_optional:
            return ProjectDto(
                id = 56,
                name = '',
                color = '',
                created_at = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'),
                updated_at = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'),
                task_ids = [
                    56
                    ]
            )
        else:
            return ProjectDto(
                id = 56,
                name = '',
                color = '',
                created_at = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'),
                updated_at = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'),
                task_ids = [
                    56
                    ],
        )
        """

    def testProjectDto(self):
        """Test ProjectDto"""
        # inst_req_only = self.make_instance(include_optional=False)
        # inst_req_and_optional = self.make_instance(include_optional=True)


if __name__ == "__main__":
    unittest.main()
